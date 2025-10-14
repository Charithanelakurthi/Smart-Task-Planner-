import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw } from "lucide-react";

interface Task {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  estimated_hours?: number;
  deadline_days?: number;
  dependencies?: string[];
}

interface TaskListProps {
  tasks: Task[];
  goal: string;
  onReset: () => void;
}

export const TaskList = ({ tasks, goal, onReset }: TaskListProps) => {
  const handleDownload = () => {
    const content = {
      goal,
      generated_at: new Date().toISOString(),
      tasks,
    };
    
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `task-plan-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalHours = tasks.reduce((sum, task) => sum + (task.estimated_hours || 0), 0);
  const maxDeadline = Math.max(...tasks.map(t => t.deadline_days || 0));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold mb-2">Your Task Plan</h2>
            <p className="text-muted-foreground text-lg">{goal}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              New Goal
            </Button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Tasks:</span>
            <span className="font-semibold">{tasks.length}</span>
          </div>
          {totalHours > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Est. Time:</span>
              <span className="font-semibold">{totalHours}h</span>
            </div>
          )}
          {maxDeadline > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Timeline:</span>
              <span className="font-semibold">{maxDeadline} days</span>
            </div>
          )}
        </div>
      </div>

      {/* Task grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((task, index) => (
          <TaskCard key={index} task={task} index={index} />
        ))}
      </div>
    </div>
  );
};