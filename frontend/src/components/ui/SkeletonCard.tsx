import React from "react";
import { Card } from "./Card";

export const SkeletonCard: React.FC = () => {
  return (
    <Card className="animate-pulse w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-text/10 rounded-md w-1/3" />
        <div className="h-6 bg-text/10 rounded-full w-20" />
      </div>
      
      {/* Body description lines */}
      <div className="space-y-2 mb-6">
        <div className="h-3.5 bg-text/10 rounded-md w-full" />
        <div className="h-3.5 bg-text/10 rounded-md w-5/6" />
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-2 border-t border-text/5">
        <div className="h-3.5 bg-text/10 rounded-md w-24" />
        <div className="h-9 bg-text/10 rounded-lg w-28" />
      </div>
    </Card>
  );
};
