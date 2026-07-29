"use client";
import { Sparkles, Brain, Globe, Shield, Server } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";

interface ModelBadgeProps {
  model: string;
  provider?: string;
  className?: string;
}

const providerConfig: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    colors: string;
  }
> = {
  openai: {
    icon: Sparkles,
    colors:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
  anthropic: {
    icon: Brain,
    colors:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
  google: {
    icon: Globe,
    colors:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  },
  meta: {
    icon: Shield,
    colors:
      "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
  },
  mistral: {
    icon: Server,
    colors:
      "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
  },
};

const defaultConfig = {
  icon: Sparkles,
  colors:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export function ModelBadge({ model, provider, className }: ModelBadgeProps) {
  const config = provider
    ? (providerConfig[provider.toLowerCase()] ?? defaultConfig)
    : defaultConfig;

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium",
        config.colors,
        className
      )}
    >
      <Icon className="size-3" />
      {model}
    </Badge>
  );
}

