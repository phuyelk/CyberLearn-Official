"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

export function WeeklyChart({ data }: { data: { day: string; xp: number }[] }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={32}>
        <CartesianGrid strokeDasharray="3 3" stroke="#242428" vertical={false} />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8b8b99", fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#4a4a56", fontSize: 11 }} width={30} />
        <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.day.slice(0, 3) === today.slice(0, 3) ? "#6e56cf" : "#242428"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
