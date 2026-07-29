"use client";

import React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ProviderFormData {
  name: string;
  slug: string;
  baseUrl: string;
  apiKeyHeader: string;
  apiKeyPrefix: string;
  timeout: number;
  maxRetries: number;
  priority: number;
  status: string;
}

interface ProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider?: {
    id: string;
    name: string;
    slug: string;
    baseUrl: string;
    apiKeyHeader: string;
    apiKeyPrefix: string;
    timeout: number;
    maxRetries: number;
    priority: number;
    status: string;
  } | null;
  onSave: (data: ProviderFormData) => void;
  isSaving?: boolean;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
  { value: "offline", label: "Offline" },
] as const;

export function ProviderDialog({
  open,
  onOpenChange,
  provider,
  onSave,
  isSaving = false,
}: ProviderDialogProps) {
  const isEditing = !!provider;
  const [name, setName] = React.useState(provider?.name ?? "");
  const [slug, setSlug] = React.useState(provider?.slug ?? "");
  const [baseUrl, setBaseUrl] = React.useState(provider?.baseUrl ?? "");
  const [apiKeyHeader, setApiKeyHeader] = React.useState(
    provider?.apiKeyHeader ?? ""
  );
  const [apiKeyPrefix, setApiKeyPrefix] = React.useState(
    provider?.apiKeyPrefix ?? ""
  );
  const [timeout, setTimeout_] = React.useState(
    provider?.timeout?.toString() ?? "30000"
  );
  const [maxRetries, setMaxRetries] = React.useState(
    provider?.maxRetries?.toString() ?? "3"
  );
  const [priority, setPriority] = React.useState(
    provider?.priority?.toString() ?? "1"
  );
  const [status, setStatus] = React.useState(provider?.status ?? "active");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(
    !!provider
  );

  React.useEffect(() => {
    if (!open) return;
    setName(provider?.name ?? "");
    setSlug(provider?.slug ?? "");
    setBaseUrl(provider?.baseUrl ?? "");
    setApiKeyHeader(provider?.apiKeyHeader ?? "");
    setApiKeyPrefix(provider?.apiKeyPrefix ?? "");
    setTimeout_(provider?.timeout?.toString() ?? "30000");
    setMaxRetries(provider?.maxRetries?.toString() ?? "3");
    setPriority(provider?.priority?.toString() ?? "1");
    setStatus(provider?.status ?? "active");
    setErrors({});
    setSlugManuallyEdited(!!provider);
  }, [open, provider]);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugManuallyEdited) {
      setSlug(generateSlug(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlug(value);
    setSlugManuallyEdited(true);
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      newErrors.slug = "Slug must be lowercase letters, numbers, and hyphens";
    }
    if (!baseUrl.trim()) {
      newErrors.baseUrl = "Base URL is required";
    } else {
      try {
        new URL(baseUrl);
      } catch {
        newErrors.baseUrl = "Enter a valid URL (e.g. https://api.openai.com)";
      }
    }
    if (!apiKeyHeader.trim()) {
      newErrors.apiKeyHeader = "API key header is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      name: name.trim(),
      slug: slug.trim(),
      baseUrl: baseUrl.trim(),
      apiKeyHeader: apiKeyHeader.trim(),
      apiKeyPrefix: apiKeyPrefix.trim(),
      timeout: parseInt(timeout, 10) || 30000,
      maxRetries: parseInt(maxRetries, 10) || 3,
      priority: parseInt(priority, 10) || 1,
      status,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Provider" : "Add Provider"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the provider configuration below."
              : "Configure a new AI provider to route requests through."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-[1fr_140px] gap-3">
            <div className="space-y-2">
              <label
                htmlFor="provider-name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="provider-name"
                placeholder="OpenAI"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="provider-slug"
                className="text-sm font-medium leading-none"
              >
                Slug <span className="text-destructive">*</span>
              </label>
              <Input
                id="provider-slug"
                placeholder="openai"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                aria-invalid={!!errors.slug}
              />
              {errors.slug && (
                <p className="text-xs text-destructive">{errors.slug}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="provider-base-url"
              className="text-sm font-medium leading-none"
            >
              Base URL <span className="text-destructive">*</span>
            </label>
            <Input
              id="provider-base-url"
              placeholder="https://api.openai.com"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              aria-invalid={!!errors.baseUrl}
            />
            {errors.baseUrl && (
              <p className="text-xs text-destructive">{errors.baseUrl}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label
                htmlFor="provider-api-header"
                className="text-sm font-medium leading-none"
              >
                API Key Header <span className="text-destructive">*</span>
              </label>
              <Input
                id="provider-api-header"
                placeholder="Authorization"
                value={apiKeyHeader}
                onChange={(e) => setApiKeyHeader(e.target.value)}
                aria-invalid={!!errors.apiKeyHeader}
              />
              {errors.apiKeyHeader && (
                <p className="text-xs text-destructive">
                  {errors.apiKeyHeader}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="provider-api-prefix"
                className="text-sm font-medium leading-none"
              >
                API Key Prefix
              </label>
              <Input
                id="provider-api-prefix"
                placeholder="Bearer"
                value={apiKeyPrefix}
                onChange={(e) => setApiKeyPrefix(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label
                htmlFor="provider-timeout"
                className="text-sm font-medium leading-none"
              >
                Timeout (ms)
              </label>
              <Input
                id="provider-timeout"
                type="number"
                min={1000}
                step={1000}
                placeholder="30000"
                value={timeout}
                onChange={(e) => setTimeout_(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="provider-retries"
                className="text-sm font-medium leading-none"
              >
                Max Retries
              </label>
              <Input
                id="provider-retries"
                type="number"
                min={0}
                max={10}
                placeholder="3"
                value={maxRetries}
                onChange={(e) => setMaxRetries(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="provider-priority"
                className="text-sm font-medium leading-none"
              >
                Priority
              </label>
              <Input
                id="provider-priority"
                type="number"
                min={1}
                max={99}
                placeholder="1"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="provider-status"
              className="text-sm font-medium leading-none"
            >
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="provider-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-1 size-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Provider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
