import { useState } from "react";
import { Hero } from "@/components/Hero";
import { GoalInput } from "@/components/GoalInput";
import { TaskList } from "@/components/TaskList";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  estimated_hours?: number;
  deadline_days?: number;
  dependencies?: string[];
}

const Index = () => {
  const [showHero, setShowHero] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (goalText: string) => {
    setIsLoading(true);
    setGoal(goalText);

    try {
      const { data, error } = await supabase.functions.invoke("generate-tasks", {
        body: { goal: goalText },
      });

      if (error) {
        console.error("Error generating tasks:", error);
        
        // Handle specific error cases
        if (error.message?.includes("Rate limit")) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive",
          });
        } else if (error.message?.includes("credits") || error.message?.includes("Payment")) {
          toast({
            title: "Credits Exhausted",
            description: "Please add more AI credits to continue.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to generate tasks. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      if (!data?.tasks || !Array.isArray(data.tasks) || data.tasks.length === 0) {
        toast({
          title: "No Tasks Generated",
          description: "Please try rephrasing your goal.",
          variant: "destructive",
        });
        return;
      }

      setTasks(data.tasks);
      setShowHero(false);
      
      toast({
        title: "Success!",
        description: `Generated ${data.tasks.length} tasks for your goal.`,
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTasks([]);
    setGoal("");
    setShowHero(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {showHero ? (
          <Hero onGetStarted={() => setShowHero(false)} />
        ) : tasks.length > 0 ? (
          <TaskList tasks={tasks} goal={goal} onReset={handleReset} />
        ) : (
          <div className="min-h-[80vh] flex items-center justify-center">
            <GoalInput onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;