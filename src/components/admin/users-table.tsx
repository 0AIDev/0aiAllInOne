"use client";

import React from "react";
import {
  Search,
  MoreHorizontal,
  UserCog,
  ToggleLeft,
  ToggleRight,
  Eye,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface User {
  id: string;
  email: string;
  name: string;
  tenantName: string;
  planTier: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

interface UsersTableProps {
  users: User[];
  onViewDetails?: (user: User) => void;
  onToggleActive?: (user: User) => void;
  onChangeRole?: (user: User) => void;
}

const PLAN_VARIANTS: Record<string, "default" | "success" | "warning" | "secondary" | "outline"> = {
  enterprise: "default",
  pro: "success",
  starter: "warning",
  free: "secondary",
  trial: "outline",
};

const ROLE_VARIANTS: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  owner: "default",
  admin: "destructive",
  member: "secondary",
  viewer: "outline",
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  }).format(date);
}

export function UsersTable({
  users,
  onViewDetails,
  onToggleActive,
  onChangeRole,
}: UsersTableProps) {
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [planFilter, setPlanFilter] = React.useState("all");

  const filtered = React.useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.tenantName.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesPlan = planFilter === "all" || u.planTier === planFilter;
      return matchesSearch && matchesRole && matchesPlan;
    });
  }, [users, search, roleFilter, planFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Last Login</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="size-10 text-muted-foreground/40" />
                    <h3 className="mt-3 text-sm font-medium">
                      {search || roleFilter !== "all" || planFilter !== "all"
                        ? "No users match your filters"
                        : "No users found"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {search || roleFilter !== "all" || planFilter !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "Users will appear here once they sign up."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium uppercase">
                        {user.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                          : user.email.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {user.name || "Unnamed User"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.tenantName}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={PLAN_VARIANTS[user.planTier] ?? "secondary"}
                      className="capitalize"
                    >
                      {user.planTier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={ROLE_VARIANTS[user.role] ?? "secondary"}
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          user.isActive ? "bg-emerald-500" : "bg-muted-foreground/30"
                        )}
                      />
                      <span className="text-xs text-muted-foreground">
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {formatDate(user.lastLoginAt)}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() => onViewDetails?.(user)}
                        >
                          <Eye className="mr-2 size-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onToggleActive?.(user)}
                        >
                          {user.isActive ? (
                            <ToggleLeft className="mr-2 size-4" />
                          ) : (
                            <ToggleRight className="mr-2 size-4" />
                          )}
                          {user.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onChangeRole?.(user)}
                        >
                          <UserCog className="mr-2 size-4" />
                          Change Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
