"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full bg-bg-elevated border border-border rounded-input px-3 py-2 text-body text-text-primary",
        "placeholder:text-text-muted",
        "focus:outline-none focus:border-border-focus",
        "transition-colors duration-hover",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
export { Input };
