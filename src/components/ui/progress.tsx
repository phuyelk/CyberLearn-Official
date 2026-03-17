"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Progress({
  value,
  max = 100,
  color = "bg-accent",
  className,
  size = "sm",
}: {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full bg-bg-elevated rounded-full overflow-hidden", size === "sm" ? "h-1.5" : "h-2.5", className)}>
      <motion.div
        className={cn("h-full rounded-full", color)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1], delay: 0.2 }}
      />
    </div>
  );
}
