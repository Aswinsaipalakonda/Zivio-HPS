import React from "react";
import { getStatusColor, getStatusLabel } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = "", ...props }) => {
  const label = getStatusLabel(status);
  const color = getStatusColor(status);

  // Return a beautiful, tactile, status-color-themed pill badge
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono tracking-wider text-white shadow-sm uppercase ${className}`}
      style={{ backgroundColor: color }}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      {label}
    </span>
  );
};
