"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useRef, type ButtonHTMLAttributes, type MouseEvent } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent/85 active:bg-accent/75",
  secondary: "bg-transparent border border-border text-text-primary hover:border-border-focus hover:bg-bg-elevated",
  ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated",
  danger: "bg-danger text-white hover:bg-danger/85 active:bg-danger/75",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-7 px-3 text-[13px] rounded-input",
  md: "h-9 px-4 text-[14px] rounded-input",
  lg: "h-11 px-6 text-[15px] rounded-card",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, onClick, ...props }, ref) => {
    const btnRef = useRef<HTMLButtonElement | null>(null);

    function handleClick(e: MouseEvent<HTMLButtonElement>) {
      const btn = btnRef.current ?? (ref as React.RefObject<HTMLButtonElement>)?.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        const diameter = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - rect.left - diameter / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - diameter / 2}px`;
        ripple.className = "absolute rounded-full bg-white/20 pointer-events-none animate-[ripple_0.5s_ease-out_forwards]";
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 550);
      }
      onClick?.(e);
    }

    return (
      <button
        ref={(node) => {
          (btnRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        className={cn(
          "relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium transition-all duration-hover select-none",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button, type ButtonProps };
