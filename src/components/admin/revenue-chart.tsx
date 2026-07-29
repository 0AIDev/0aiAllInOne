"use client";

import React from "react";
import {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  subscribers: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

interface SummaryCard {
  title: string;
  value: string;
  subtext: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function RevenueChart({ data }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const maxSubscribers = Math.max(...data.map((d) => d.subscribers), 1);

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const latestSubscribers = data[data.length - 1]?.subscribers ?? 0;
  const mrr = data[data.length - 1]?.revenue ?? 0;
  const prevSubscribers = data.length >= 2 ? data[data.length - 2]?.subscribers ?? 0 : 0;
  const churnRate =
    data.length >= 2
      ? Math.max(
          0,
          ((prevSubscribers - latestSubscribers) /
            Math.max(prevSubscribers, 1)) *
            100
        ).toFixed(1)
      : "0.0";

  const summaryCards: SummaryCard[] = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      subtext: "YTD cumulative",
      trend: "up",
      icon: <DollarSign className="size-4" />,
      color: "text-emerald-400",
    },
    {
      title: "Active Subscribers",
      value: formatNumber(latestSubscribers),
      subtext: "Current total",
      trend: "up",
      icon: <Users className="size-4" />,
      color: "text-blue-400",
    },
    {
      title: "MRR",
      value: formatCurrency(mrr),
      subtext: "Monthly recurring",
      trend: "up",
      icon: <TrendingUp className="size-4" />,
      color: "text-purple-400",
    },
    {
      title: "Churn Rate",
      value: `${churnRate}%`,
      subtext: "Est. monthly",
      trend: Number.parseFloat(churnRate) > 5 ? "down" : "up",
      icon: <TrendingDown className="size-4" />,
      color: Number.parseFloat(churnRate) > 5 ? "text-red-400" : "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={cn("shrink-0", card.color)}>{card.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground">{card.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              Revenue & Subscribers
            </CardTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-sm bg-emerald-500" />
                Revenue
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-sm bg-blue-500" />
                Subscribers
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BarChart3 className="size-12 text-muted-foreground/30" />
              <h3 className="mt-3 text-sm font-medium">No revenue data</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Revenue data will appear here once transactions start flowing.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-medium text-muted-foreground">
                  Revenue per month
                </p>
                <div className="flex items-end gap-1.5 h-32">
                  {data.map((point) => {
                    const heightPct = (point.revenue / maxRevenue) * 100;
                    return (
                      <div
                        key={point.month}
                        className="group relative flex flex-1 flex-col items-center justify-end"
                      >
                        <div
                          className="w-full rounded-t bg-emerald-500/80 transition-colors hover:bg-emerald-500"
                          style={{
                            height: `${Math.max(heightPct, 2)}%`,
                          }}
                        />
                        <span className="mt-2 text-[10px] text-muted-foreground">
                          {point.month}
                        </span>
                        <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs opacity-0 shadow transition-opacity group-hover:opacity-100">
                          {formatCurrency(point.revenue)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium text-muted-foreground">
                  Subscribers
                </p>
                <div className="relative h-32 w-full">
                  <svg
                    className="h-full w-full"
                    viewBox={`0 0 ${(data.length - 1) * 80} 130`}
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(59 130 246 / 0.3)" />
                        <stop offset="100%" stopColor="rgb(59 130 246 / 0.02)" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const points = data.map((d, i) => {
                        const x = i * 80;
                        const y = 130 - (d.subscribers / maxSubscribers) * 120;
                        return `${x},${y}`;
                      });

                      const areaPath = `M0,130 L${points.join(" L")} L${
                        (data.length - 1) * 80
                      },130 Z`;
                      const linePath = `M${points.join(" L")}`;

                      return (
                        <>
                          <path
                            d={areaPath}
                            fill="url(#subGrad)"
                            stroke="none"
                          />
                          <path
                            d={linePath}
                            fill="none"
                            stroke="rgb(59 130 246 / 0.8)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </>
                      );
                    })()}
                  </svg>

                  <div className="flex justify-between px-0">
                    {data.map((point) => (
                      <span
                        key={point.month}
                        className="mt-1 text-[10px] text-muted-foreground"
                      >
                        {point.month}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
