import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";

interface GoalInputProps {
  onGenerate: (goal: string) => Promise<void>;
  isLoading: boolean;
}

export const GoalInput = ({ onGenerate, isLoading }: GoalInputProps) => {
  const [goal, setGoal] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim() && !isLoading) {
      await onGenerate(goal.trim());
    }
  };

  const examples = [
    "Launch a product in 2 weeks",
    "Plan a wedding in 6 months",
    "Learn web development in 3 months",
    "Start a freelance business",
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Card className="p-6 md:p-8 backdrop-blur-sm bg-card/80 border-border shadow-[var(--shadow-elegant)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="goal" className="text-lg font-semibold flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              What's your goal?
            </label>
            <Textarea
              id="goal"
              placeholder="e.g., Launch a mobile app in 3 months"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="min-h-[120px] text-base resize-none"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!goal.trim() || isLoading}
            className="w-full text-lg py-6 rounded-xl shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-glow)] transition-all hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Tasks...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Task Plan
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Example prompts */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground text-center">Or try an example:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setGoal(example)}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm rounded-full bg-muted/50 hover:bg-muted transition-colors border border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};