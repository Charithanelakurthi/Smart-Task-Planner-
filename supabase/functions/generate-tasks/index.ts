import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal } = await req.json();
    console.log('Generating tasks for goal:', goal);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert project planner. Break down user goals into actionable tasks with realistic timelines, dependencies, and priorities. 
            
Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, no explanations):
{
  "tasks": [
    {
      "title": "Clear, actionable task name",
      "description": "Detailed description of what needs to be done",
      "priority": "low|medium|high",
      "category": "Category name",
      "estimated_hours": number,
      "deadline_days": number,
      "dependencies": ["Dependency 1", "Dependency 2"]
    }
  ]
}

Guidelines:
- Create 3-7 tasks
- Be specific and actionable
- Estimate realistic hours (1-40)
- Set deadline_days relative to start (e.g., 1-14 days)
- List dependencies as task titles that must complete first
- Prioritize based on urgency and dependencies
- Categories: Planning, Research, Development, Design, Marketing, Testing, Deployment, etc.`
          },
          {
            role: 'user',
            content: `Break down this goal: "${goal}"`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('Failed to generate tasks');
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data));
    
    let content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Clean up the response - remove markdown code blocks if present
    content = content.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }

    let parsedTasks;
    try {
      parsedTasks = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    if (!parsedTasks.tasks || !Array.isArray(parsedTasks.tasks)) {
      throw new Error('Invalid tasks structure in AI response');
    }

    console.log('Successfully generated tasks:', parsedTasks.tasks.length);

    return new Response(
      JSON.stringify(parsedTasks),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-tasks function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate tasks';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});