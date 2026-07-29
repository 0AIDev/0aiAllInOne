"use client";

import React from "react";
import {
  Activity,
  Clock,
  AlertTriangle,
  Zap,
  Gauge,
  Wifi,
  WifiOff,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ProviderHealth {
  providerId: string;
  providerName: string;
  status: string;
  latencyMs: number;
  errorRate: number;
  successRate: number;
  lastCheckedAt: string;
}

interface HealthIndicatorProps {
  health: ProviderHealth;
  className?: string;
}

function formatLatency(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);

  if (diffSecs < 5) return "just now";
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

interface StatusInfo {
  label: string;
  dotColor: string;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
}

const STATUS_CONFIG = {
  healthy: {
    label: "Healthy",
    dotColor: "bg-emerald-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    icon: <Wifi className="size-4" />,
  },
  operational: {
    label: "Operational",
    dotColor: "bg-emerald-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    icon: <Wifi className="size-4" />,
  },
  degraded: {
    label: "Degraded",
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
    icon: <AlertTriangle className="size-4" />,
  },
  down: {
    label: "Down",
    dotColor: "bg-red-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
    icon: <WifiOff className="size-4" />,
  },
  error: {
    label: "Error",
    dotColor: "bg-red-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
    icon: <AlertTriangle className="size-4" />,
  },
  offline: {
    label: "Offline",
    dotColor: "bg-muted-foreground/30",
    bgColor: "bg-muted",
    textColor: "text-muted-foreground",
    icon: <WifiOff className="size-4" />,
  },
  unknown: {
    label: "Unknown",
    dotColor: "bg-muted-foreground/30",
    bgColor: "bg-muted",
    textColor: "text-muted-foreground",
    icon: <Activity className="size-4" />,
  },
};

function getStatusConfig(status: string): StatusInfo {
  const key = status in STATUS_CONFIG ? status : "unknown";
  return STATUS_CONFIG[key as keyof typeof STATUS_CONFIG];
}

function getPerformanceLevel(value: number, thresholds: [number, number, number]) {
  if (value <= thresholds[0]) return "text-emerald-500";
  if (value <= thresholds[1]) return "text-amber-500";
  return "text-red-500";
}

export function HealthIndicator({ health, className }: HealthIndicatorProps) {
  const statusCfg = getStatusConfig(health.status);
  const latencyColor = getPerformanceLevel(health.latencyMs, [200, 500, 1000]);
  const errorRateColor = getPerformanceLevel(health.errorRate * 100, [1, 5, 15]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn("size-2.5 rounded-full", statusCfg.dotColor)} />
          <CardTitle className="text-sm font-medium">
            {health.providerName}
          </CardTitle>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[11px] font-normal",
            statusCfg.bgColor,
            statusCfg.textColor
          )}
        >
          <span className="mr-1.5">{statusCfg.icon}</span>
          {statusCfg.label}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1 rounded-lg bg-muted/50 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="size-3" />
              Latency
            </div>
            <p className={cn("text-lg font-bold tracking-tight", latencyColor)}>
              {formatLatency(health.latencyMs)}
            </p>
          </div>

          <div className="space-y-1 rounded-lg bg-muted/50 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Gauge className="size-3" />
              Success
            </div>
            <p
              className={cn(
                "text-lg font-bold tracking-tight",
                health.successRate >= 98
                  ? "text-emerald-500"
                  : health.successRate >= 90
                    ? "text-amber-500"
                    : "text-red-500"
              )}
            >
              {(health.successRate * 100).toFixed(1)}%
            </p>
          </div>

          <div className="space-y-1 rounded-lg bg-muted/50 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <AlertTriangle className="size-3" />
              Errors
            </div>
            <p className={cn("text-lg font-bold tracking-tight", errorRateColor)}>
              {(health.errorRate * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Success rate bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Success Rate</span>
            <span className="font-medium">
              {(health.successRate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                health.successRate >= 98
                  ? "bg-emerald-500"
                  : health.successRate >= 90
                    ? "bg-amber-500"
                    : "bg-red-500"
              )}
              style={{ width: `${Math.min(health.successRate * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Latency bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Latency</span>
            <span className="font-medium">{formatLatency(health.latencyMs)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                health.latencyMs <= 200
                  ? "bg-emerald-500"
                  : health.latencyMs <= 500
                    ? "bg-amber-500"
                    : "bg-red-500"
              )}
              style={{
                width: `${Math.min((health.latencyMs / 1000) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Last checked */}
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3" />
            Last Checked
          </div>
          <span className="text-xs font-medium">
            {formatRelativeTime(health.lastCheckedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
