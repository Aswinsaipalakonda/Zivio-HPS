import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "pressed" | "outline";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", variant = "flat", padding = "md", children, ...props }, ref) => {
    let cardStyleClass = "";
    switch (variant) {
      case "pressed":
        // Soft recess for list containers or embedded panels
        cardStyleClass = "bg-slate-50/50 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800/80 shadow-inner";
        break;
      case "outline":
        cardStyleClass = "bg-transparent border border-slate-200 dark:border-slate-800";
        break;
      case "flat":
      default:
        // Premium elevation card
        cardStyleClass = "bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow duration-200";
        break;
    }

    let paddingClass = "";
    switch (padding) {
      case "none":
        paddingClass = "p-0";
        break;
      case "sm":
        paddingClass = "p-3 sm:p-4";
        break;
      case "lg":
        paddingClass = "p-6 sm:p-8";
        break;
      case "md":
      default:
        paddingClass = "p-4 sm:p-6";
        break;
    }

    return (
      <div
        ref={ref}
        className={`rounded-[24px] ${cardStyleClass} ${paddingClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
