import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "pressed";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", variant = "flat", padding = "md", children, ...props }, ref) => {
    let shadowClass = "";
    switch (variant) {
      case "pressed":
        shadowClass = "shadow-neu-pressed";
        break;
      case "flat":
      default:
        shadowClass = "shadow-neu-flat";
        break;
    }

    let paddingClass = "";
    switch (padding) {
      case "none":
        paddingClass = "p-0";
        break;
      case "sm":
        paddingClass = "p-3";
        break;
      case "lg":
        paddingClass = "p-8";
        break;
      case "md":
      default:
        paddingClass = "p-6";
        break;
    }

    return (
      <div
        ref={ref}
        className={`bg-surface rounded-neu border border-white/40 ${shadowClass} ${paddingClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
