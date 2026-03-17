import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "accent";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-bg-elevated text-text-secondary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  accent: "bg-accent-soft text-accent",
};

export function Badge({
  variant = "default",
  children,
  className,
  glow = false,
}: {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-medium uppercase tracking-[0.05em]",
        variantStyles[variant],
        glow && "animate-pulse-glow",
        className
      )}
    >
      {children}
    </span>
  );
}
