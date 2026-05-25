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
    <Card variant="flat" padding="lg" className="w-full flex flex-col items-center justify-center text-center bg-white border border-slate-100 shadow-sm rounded-2xl">
      {/* Icon Wrapper in a Recessed Circle */}
      <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
        <Icon className="w-8 h-8" />
      </div>
      
      <h3 className="text-base font-bold text-slate-800 mb-1">
        {title}
      </h3>
      
      <p className="text-xs font-semibold text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      
      {action && <div className="w-full flex justify-center">{action}</div>}
    </Card>
  );
};
