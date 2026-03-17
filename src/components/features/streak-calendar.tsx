"use client";

import { cn } from "@/lib/utils";

export function StreakCalendar({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-bg-elevated";
    if (count === 1) return "bg-accent/20";
    if (count === 2) return "bg-accent/45";
    return "bg-accent/75";
  };

  return (
    <div className="flex flex-wrap gap-1">
      {entries.map(([date, count]) => (
        <div
          key={date}
          className={cn("w-4 h-4 rounded-[3px] transition-colors", getIntensity(count))}
          title={`${date}: ${count} activities`}
        />
      ))}
    </div>
  );
}
