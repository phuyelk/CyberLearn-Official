"use client";

export function ArcGauge({ value, max = 100, size = 180 }: { value: number; max?: number; size?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const sw = 12;
  const r = (size - sw) / 2;
  const cx = size / 2, cy = size / 2;
  const startA = -210, endA = 30;
  const valA = startA + (pct / 100) * (endA - startA);

  const pol = (a: number) => ({ x: cx + r * Math.cos((a * Math.PI) / 180), y: cy + r * Math.sin((a * Math.PI) / 180) });
  const arc = (s: number, e: number) => {
    const sp = pol(s), ep = pol(e);
    return `M ${sp.x} ${sp.y} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${ep.x} ${ep.y}`;
  };

  const color = pct < 40 ? "#30a46c" : pct < 70 ? "#f76b15" : "#e5484d";
  const label = pct < 40 ? "Low Risk" : pct < 70 ? "Medium Risk" : "High Risk";

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.75}`}>
        <path d={arc(startA, endA)} fill="none" stroke="#242428" strokeWidth={sw} strokeLinecap="round" />
        {pct > 0 && <path d={arc(startA, valA)} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" style={{ transition: "all 0.5s ease" }} />}
        <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontSize: "36px", fontWeight: 600, fill: color }}>{value}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" style={{ fontSize: "12px", fill: "#8b8b99" }}>/ {max}</text>
      </svg>
      <p className="text-[14px] font-medium -mt-2" style={{ color }}>{label}</p>
    </div>
  );
}
