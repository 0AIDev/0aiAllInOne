"use client";
import { Calendar, Zap } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubscriptionCardProps {
  subscription: {
    planTier: string;
    status: string;
    billingInterval: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    tokensUsed: number;
    tokensTotal: number;
  };
  className?: string;
}

const statusVariant: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  active: "default",
  past_due: "destructive",
  canceled: "secondary",
  trialing: "outline",
};

const planColors: Record<string, string> = {
  Free: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Starter:
    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Pro: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  Enterprise:
    "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
};

export function SubscriptionCard({
  subscription,
  className,
}: SubscriptionCardProps) {
  const usagePercent = Math.min(
    Math.round((subscription.tokensUsed / subscription.tokensTotal) * 100),
    100
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatNumber = (n: number) => n.toLocaleString();

  const planClass =
    planColors[subscription.planTier] ??
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{subscription.planTier}</CardTitle>
              <p className="text-xs text-muted-foreground capitalize">
                {subscription.billingInterval} billing
              </p>
            </div>
          </div>
          <Badge
            variant={statusVariant[subscription.status] ?? "outline"}
            className={cn(
              "text-[10px] uppercase tracking-wider",
              subscription.status === "active" && planClass
            )}
          >
            {subscription.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Calendar className="size-4 shrink-0" />
          <span>
            {formatDate(subscription.currentPeriodStart)} &mdash;{" "}
            {formatDate(subscription.currentPeriodEnd)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Token usage</span>
            <span className="font-medium tabular-nums">
              {formatNumber(subscription.tokensUsed)} /{" "}
              {formatNumber(subscription.tokensTotal)}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                usagePercent > 90
                  ? "bg-destructive"
                  : usagePercent > 70
                    ? "bg-amber-500"
                    : "bg-primary"
              )}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">
              {usagePercent}% used
            </span>
            {subscription.tokensTotal > 0 && (
              <span className="text-xs text-muted-foreground">
                {formatNumber(
                  subscription.tokensTotal - subscription.tokensUsed
                )}{" "}
                remaining
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

