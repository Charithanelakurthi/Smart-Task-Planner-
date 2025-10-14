import { Button } from "@/components/ui/button";
import { Sparkles, Target, CheckCircle2 } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-[var(--shadow-glow)] animate-scale-in">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Heading */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Smart Task{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Planner
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your goals into actionable tasks with AI-powered planning.
              Get timelines, dependencies, and priorities instantly.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 animate-fade-in delay-200">
            {[
              { icon: Target, text: "Break Down Goals" },
              { icon: CheckCircle2, text: "Smart Dependencies" },
              { icon: Sparkles, text: "AI-Powered" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:scale-105"
              >
                <feature.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in delay-300">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="text-lg px-8 py-6 rounded-xl shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-glow)] transition-all hover:scale-105"
            >
              Get Started
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Stats or Social Proof */}
          <div className="pt-8 text-sm text-muted-foreground animate-fade-in delay-400">
            <p>Powered by advanced AI • Free to use • No signup required</p>
          </div>
        </div>
      </div>
    </div>
  );
};