import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-bg-panel border border-border rounded-card p-[20px]",
        hoverable && "transition-colors duration-hover hover:border-border-focus",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";
export { Card };
