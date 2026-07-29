"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ChartData {
  date: string;
  tokens: number;
  cost: number;
  requests: number;
}

export function UsageChart({ data }: { data: ChartData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[#7A7870]">
        No usage data for the last 30 days
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter Tight', sans-serif" }}>
      <h3 className="text-sm font-semibold text-[#0F0F0E] mb-4">
        Daily Token Usage
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,15,14,0.08)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fontFamily: "'Inter Tight', sans-serif", fill: "#7A7870" }}
            axisLine={{ stroke: "rgba(15,15,14,0.08)" }}
            tickLine={false}
            tickFormatter={(d: string) =>
              new Date(d).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: "'Inter Tight', sans-serif", fill: "#7A7870" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid rgba(15,15,14,0.08)",
              backgroundColor: "#FFFFFF",
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: "13px",
              color: "#0F0F0E",
              boxShadow: "0 4px 12px rgba(15,15,14,0.06)",
            }}
          />
          <Legend
            wrapperStyle={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: "12px",
              color: "#3A3A37",
            }}
          />
          <Bar
            dataKey="tokens"
            fill="#0F0F0E"
            name="Tokens"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="requests"
            fill="#DEDBD1"
            name="Requests"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
