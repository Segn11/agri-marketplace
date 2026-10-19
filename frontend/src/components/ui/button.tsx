import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-green-700 hover:bg-green-800 text-white focus:ring-green-600 shadow-sm",
      secondary: "bg-green-100 hover:bg-green-200 text-green-900 focus:ring-green-400",
      outline: "border border-gray-300 hover:bg-gray-100 text-gray-700 focus:ring-gray-300",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
      ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-200",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
