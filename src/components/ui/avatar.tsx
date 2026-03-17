import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "w-8 h-8 text-[12px]",
  md: "w-9 h-9 text-[13px]",
  lg: "w-16 h-16 text-[22px]",
};

export function Avatar({
  src,
  name,
  size = "sm",
  className,
}: {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initial = (name ?? "U").charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "Avatar"}
        className={cn(
          "rounded-full object-cover shrink-0",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-bg-elevated flex items-center justify-center shrink-0 font-semibold text-text-secondary",
        sizeClasses[size],
        className
      )}
    >
      {initial}
    </div>
  );
}
