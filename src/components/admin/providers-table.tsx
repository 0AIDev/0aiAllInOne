"use client";

import React from "react";
import {
  Search,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Plus,
  Filter,
  ArrowUpDown,
  Database,
  Key,
  Box,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export interface Provider {
  id: string;
  name: string;
  slug: string;
  status: string;
  priority: number;
  modelsCount: number;
  keysCount: number;
}

interface ProvidersTableProps {
  providers: Provider[];
  onEdit?: (provider: Provider) => void;
  onToggle?: (provider: Provider) => void;
  onDelete?: (provider: Provider) => void;
  onAdd?: () => void;
}

const STATUS_VARIANTS: Record<string, "default" | "success" | "destructive" | "warning" | "secondary" | "outline"> = {
  active: "success",
  enabled: "success",
  disabled: "warning",
  error: "destructive",
  degraded: "warning",
  offline: "destructive",
};

export function ProvidersTable({
  providers,
  onEdit,
  onToggle,
  onDelete,
  onAdd,
}: ProvidersTableProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filtered = React.useMemo(() => {
    return providers.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [providers, search, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search providers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 size-3" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="degraded">Degraded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onAdd} size="sm">
          <Plus className="mr-1 size-4" />
          Add Provider
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">
                <button
                  className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground"
                >
                  Name
                  <ArrowUpDown className="size-3" />
                </button>
              </TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Models</TableHead>
              <TableHead className="text-center">Keys</TableHead>
              <TableHead className="text-center">Priority</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Box className="size-10 text-muted-foreground/40" />
                    <h3 className="mt-3 text-sm font-medium">
                      {search || statusFilter !== "all"
                        ? "No providers match your filters"
                        : "No providers configured"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {search || statusFilter !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "Add your first AI provider to get started."}
                    </p>
                    {(search || statusFilter !== "all") ? null : (
                      <Button onClick={onAdd} variant="outline" size="sm" className="mt-4">
                        <Plus className="mr-1 size-3" />
                        Add Provider
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.name}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {provider.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        STATUS_VARIANTS[provider.status] ?? "secondary"
                      }
                      className="capitalize"
                    >
                      {provider.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <Database className="size-3.5 text-muted-foreground" />
                      <span>{provider.modelsCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <Key className="size-3.5 text-muted-foreground" />
                      <span>{provider.keysCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      {provider.priority}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label="Edit provider"
                        onClick={() => onEdit?.(provider)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label={
                          provider.status === "active"
                            ? "Disable provider"
                            : "Enable provider"
                        }
                        onClick={() => onToggle?.(provider)}
                      >
                        {provider.status === "active" ? (
                          <ToggleRight className="size-4 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="size-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        aria-label="Delete provider"
                        onClick={() => onDelete?.(provider)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
