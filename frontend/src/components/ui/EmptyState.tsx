import React from "react";
import { Card } from "./Card";
import { HelpCircle } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ComponentType<any>;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = HelpCircle,
  title,
  description,
  action,
}) => {
  return (
    <Card variant="pressed" padding="lg" className="w-full flex flex-col items-center justify-center text-center">
      {/* Icon Wrapper in a Neumorphic Recessed Circle */}
      <div className="w-16 h-16 rounded-full bg-surface shadow-neu-sm border border-white/50 flex items-center justify-center mb-4 text-text/60">
        <Icon className="w-8 h-8" />
      </div>
      
      <h3 className="font-mono text-lg font-bold text-text mb-1 tracking-wide">
        {title}
      </h3>
      
      <p className="text-sm text-text/60 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      
      {action && <div className="w-full flex justify-center">{action}</div>}
    </Card>
  );
};
