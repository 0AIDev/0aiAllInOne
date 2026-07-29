"use client";
import { TrendingUp, TrendingDown } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  icon,
  title,
  value,
  description,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
            </div>
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                  : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        {description && (
          <p className="mt-3 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

