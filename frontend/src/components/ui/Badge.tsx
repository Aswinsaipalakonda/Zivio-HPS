import React from "react";
import { getStatusLabel } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = "", ...props }) => {
  const label = getStatusLabel(status);
  const statusUpper = status?.toUpperCase();

  let styles = "";
  switch (statusUpper) {
    case "COMPLETED":
      styles = "bg-emerald-50 text-emerald-700 border-emerald-100";
      break;
    case "IN_PROGRESS":
      styles = "bg-blue-50 text-blue-700 border-blue-100";
      break;
    case "PENDING":
      styles = "bg-amber-50 text-amber-700 border-amber-100";
      break;
    case "NOT_STARTED":
    default:
      styles = "bg-slate-100 text-slate-600 border-slate-200";
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-sans tracking-wide border ${styles} ${className}`}
      {...props}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        statusUpper === "COMPLETED" ? "bg-emerald-500" :
        statusUpper === "IN_PROGRESS" ? "bg-blue-500" :
        statusUpper === "PENDING" ? "bg-amber-500" : "bg-slate-400"
      }`} />
      {label}
    </span>
  );
};
