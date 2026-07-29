"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UsageChartProps {
  data: Array<{ label: string; value: number }>;
  title: string;
  className?: string;
}

export function UsageChart({ data, title, className }: UsageChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3 h-48">
          {data.map((item) => {
            const heightPercent = Math.max(
              (item.value / maxValue) * 100,
              2
            );

            return (
              <div
                key={item.label}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <span className="text-xs font-medium tabular-nums text-muted-foreground">
                  {item.value.toLocaleString()}
                </span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary/80 to-primary transition-all duration-500 ease-out"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

