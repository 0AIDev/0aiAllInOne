"use client";

import { useState } from "react";
import { Copy, Check, Trash2, Clock, Shield } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ApiKeyCardProps {
  apiKey: {
    id: string;
    name: string;
    prefixKey: string;
    status: string;
    createdAt: string;
    lastUsedAt?: string;
  };
  onRevoke: (id: string) => void;
  showFull?: boolean;
  fullKey?: string;
  className?: string;
}

const statusVariant: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  active: "default",
  revoked: "destructive",
  expired: "secondary",
};

export function ApiKeyCard({
  apiKey,
  onRevoke,
  showFull,
  fullKey,
  className,
}: ApiKeyCardProps) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const maskedKey =
    fullKey && showFull
      ? fullKey
      : `${apiKey.prefixKey}${"*".repeat(28)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(maskedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  const handleRevoke = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    onRevoke(apiKey.id);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <span className="font-semibold">{apiKey.name}</span>
              <Badge
                variant={statusVariant[apiKey.status] ?? "outline"}
                className="text-[10px] uppercase tracking-wider"
              >
                {apiKey.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={maskedKey}
                className="h-8 max-w-[340px] cursor-default bg-muted font-mono text-xs focus-visible:ring-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                onClick={handleCopy}
                aria-label="Copy key"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                Created {new Date(apiKey.createdAt).toLocaleDateString()}
              </span>
              {apiKey.lastUsedAt && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  Last used {new Date(apiKey.lastUsedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <Button
              variant={confirming ? "destructive" : "outline"}
              size="sm"
              onClick={handleRevoke}
              onBlur={() => setConfirming(false)}
              className="shrink-0"
            >
              <Trash2 className="mr-1 size-3.5" />
              {confirming ? "Confirm?" : "Revoke"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
