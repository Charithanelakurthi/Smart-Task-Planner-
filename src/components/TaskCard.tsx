import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Link as LinkIcon } from "lucide-react";

interface TaskCardProps {
  task: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    category: string;
    estimated_hours?: number;
    deadline_days?: number;
    dependencies?: string[];
  };
  index: number;
}

const priorityColors = {
  low: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  high: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

export const TaskCard = ({ task, index }: TaskCardProps) => {
  return (
    <Card className="p-6 hover:shadow-[var(--shadow-elegant)] transition-all hover:scale-[1.02] animate-fade-in bg-card/80 backdrop-blur-sm"
      style={{ animationDelay: `${index * 100}ms` }}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-semibold leading-tight">{task.title}</h3>
            <p className="text-sm text-muted-foreground">{task.category}</p>
          </div>
          <Badge
            variant="outline"
            className={`${priorityColors[task.priority]} capitalize shrink-0`}
          >
            {task.priority}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {task.description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-sm">
          {task.estimated_hours && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{task.estimated_hours}h</span>
            </div>
          )}
          {task.deadline_days && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Day {task.deadline_days}</span>
            </div>
          )}
        </div>

        {/* Dependencies */}
        {task.dependencies && task.dependencies.length > 0 && (
          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Dependencies</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {task.dependencies.map((dep, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {dep}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};