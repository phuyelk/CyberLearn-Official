import { cn } from "@/lib/utils";
import { Info, AlertTriangle, Lightbulb } from "lucide-react";

type Variant = "info" | "warning" | "tip";

const config: Record<Variant, { icon: typeof Info; border: string; bg: string; iconColor: string }> = {
  info: { icon: Info, border: "border-l-accent", bg: "bg-accent-soft", iconColor: "text-accent" },
  warning: { icon: AlertTriangle, border: "border-l-warning", bg: "bg-warning/10", iconColor: "text-warning" },
  tip: { icon: Lightbulb, border: "border-l-success", bg: "bg-success/10", iconColor: "text-success" },
};

export function Callout({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, border, bg, iconColor } = config[variant];
  return (
    <div className={cn("border-l-[3px] rounded-r-card p-4 my-4", border, bg, className)}>
      <div className="flex gap-3">
        <Icon size={16} className={cn("mt-0.5 shrink-0", iconColor)} />
        <div className="min-w-0">
          {title && <p className="font-medium text-text-primary text-[14px] mb-1">{title}</p>}
          <div className="text-text-secondary text-[14px] leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
