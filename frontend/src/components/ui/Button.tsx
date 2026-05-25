import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  shape?: "rounded" | "pill";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "secondary", shape = "rounded", isLoading, fullWidth, children, disabled, ...props }, ref) => {
    let variantClass = "";
    switch (variant) {
      case "primary":
        variantClass = "bg-[#3A9DE9] text-white hover:bg-[#2480CC] shadow-sm hover:shadow active:scale-[0.98]";
        break;
      case "danger":
        variantClass = "bg-danger text-white hover:bg-red-600 shadow-sm hover:shadow active:scale-[0.98]";
        break;
      case "outline":
        variantClass = "bg-transparent text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-[0.98]";
        break;
      case "ghost":
        variantClass = "bg-transparent text-text hover:bg-slate-50 border border-transparent active:bg-slate-100";
        break;
      case "secondary":
      default:
        variantClass = "bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-sm active:scale-[0.98]";
        break;
    }

    const widthClass = fullWidth ? "w-full" : "";
    const disabledClass = disabled || isLoading ? "opacity-50 cursor-not-allowed transform-none active:scale-100 pointer-events-none" : "";
    const shapeClass = shape === "pill" ? "rounded-full px-6" : "rounded-xl px-4";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-sans text-xs sm:text-sm font-bold transition-all duration-150 focus:outline-none ${variantClass} ${widthClass} ${disabledClass} ${shapeClass} ${className}`}
        style={{ minHeight: "40px" }}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
