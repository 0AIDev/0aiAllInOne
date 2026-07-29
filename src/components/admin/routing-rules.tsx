"use client";

import React from "react";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Route,
  AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

export interface RoutingRule {
  id: string;
  name: string;
  matchModel: string;
  strategy: string;
  targetChain: string[];
  isActive: boolean;
  priority: number;
}

interface RoutingRulesProps {
  rules: RoutingRule[];
  onAdd?: () => void;
  onEdit?: (rule: RoutingRule) => void;
  onDelete?: (rule: RoutingRule) => void;
  onToggle?: (rule: RoutingRule) => void;
  onReorder?: (rules: RoutingRule[]) => void;
}

const STRATEGY_CONFIG: Record<
  string,
  { label: string; variant: "default" | "success" | "secondary" | "info" | "warning" | "outline"; color: string }
> = {
  PRIORITY: {
    label: "Priority",
    variant: "default",
    color: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  },
  COST_OPTIMIZED: {
    label: "Cost Optimized",
    variant: "success",
    color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  FUSION: {
    label: "Fusion",
    variant: "info",
    color: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  },
  ROUND_ROBIN: {
    label: "Round Robin",
    variant: "secondary",
    color: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  },
  FALLBACK: {
    label: "Fallback",
    variant: "warning",
    color: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  LATENCY_OPTIMIZED: {
    label: "Latency Optimized",
    variant: "outline",
    color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  },
  LOAD_BALANCED: {
    label: "Load Balanced",
    variant: "outline",
    color: "border-pink-500/30 bg-pink-500/10 text-pink-400",
  },
};

function getStrategyConfig(strategy: string) {
  return (
    STRATEGY_CONFIG[strategy] ?? {
      label: strategy,
      variant: "secondary" as const,
      color: "border-muted bg-muted/50 text-muted-foreground",
    }
  );
}

export function RoutingRules({
  rules,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
  onReorder: _onReorder,
}: RoutingRulesProps) {
  const sorted = React.useMemo(
    () => [...rules].sort((a, b) => a.priority - b.priority),
    [rules]
  );

  if (rules.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Route className="size-12 text-muted-foreground/30" />
          <h3 className="mt-4 text-sm font-medium">No routing rules</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Create routing rules to control how model requests are directed to providers.
          </p>
          <Button onClick={onAdd} size="sm" className="mt-5">
            <Plus className="mr-1 size-4" />
            Create Rule
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {rules.length} rule{rules.length !== 1 ? "s" : ""} configured
        </p>
        <Button onClick={onAdd} size="sm">
          <Plus className="mr-1 size-4" />
          Add Rule
        </Button>
      </div>

      <div className="space-y-2">
        {sorted.map((rule, _index) => {
          const strategy = getStrategyConfig(rule.strategy);

          return (
            <Card
              key={rule.id}
              className={cn(
                "group relative overflow-hidden transition-shadow hover:shadow-md",
                !rule.isActive && "opacity-60"
              )}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <button
                  className="cursor-grab text-muted-foreground/40 transition-colors hover:text-muted-foreground active:cursor-grabbing"
                  aria-label="Drag to reorder"
                  tabIndex={-1}
                >
                  <GripVertical className="size-4" />
                </button>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {rule.name}
                    </span>
                    <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      #{rule.priority}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {rule.matchModel}
                    </code>

                    <span className="text-xs text-muted-foreground">&rarr;</span>

                    <Badge
                      variant="outline"
                      className={cn("text-[11px] font-normal", strategy.color)}
                    >
                      {strategy.label}
                    </Badge>

                    <span className="text-xs text-muted-foreground">&rarr;</span>

                    <div className="flex items-center gap-1">
                      {rule.targetChain.map((target) => (
                        <Badge
                          key={target}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {target}
                        </Badge>
                      ))}
                      {rule.targetChain.length === 0 && (
                        <span className="text-xs text-muted-foreground/60 italic">
                          No targets
                        </span>
                      )}
                    </div>
                  </div>

                  {!rule.isActive && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-500">
                      <AlertCircle className="size-3" />
                      This rule is currently disabled
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => onToggle?.(rule)}
                    aria-label={rule.isActive ? "Disable rule" : "Enable rule"}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Edit rule"
                    onClick={() => onEdit?.(rule)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                    aria-label="Delete rule"
                    onClick={() => onDelete?.(rule)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
