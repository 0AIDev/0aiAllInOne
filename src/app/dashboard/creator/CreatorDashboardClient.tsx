"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { ArrowUpRight, Sparkles, Wallet } from "lucide-react";

interface ChartBar {
  label: string;
  revenue: number;
  height: number;
}

interface SkillSummary {
  id: string;
  title: string;
  status: string;
  downloads: number;
  revenue: number;
}

interface Props {
  totalEarnings: number;
  walletBalance: number;
  skillsCount: number;
  totalDownloads: number;
  chartData: ChartBar[];
  skills: SkillSummary[];
}

const statusBadge = (status: string) => {
  switch (status) {
    case "PUBLISHED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "DRAFT":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200";
    case "ARCHIVED":
      return "bg-gray-50 text-gray-500 border-gray-200";
    default:
      return "bg-gray-50 text-gray-500 border-gray-200";
  }
};

export function CreatorDashboardClient({
  totalEarnings,
  walletBalance,
  skillsCount,
  totalDownloads,
  chartData,
  skills,
}: Props) {
  const canWithdraw = walletBalance >= 20;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p
            className="text-sm text-[#7A7870]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Balance
          </p>
          <p
            className="text-[32px] font-semibold tracking-tight text-[#0F0F0E]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            ${walletBalance.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/creator/skills/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0F0F0E] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            <Sparkles className="size-4" />
            Create New Skill
          </Link>
          <button
            disabled={!canWithdraw}
            title={!canWithdraw ? "Minimum $20 to withdraw" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
              canWithdraw
                ? "border-[rgba(15,15,14,0.12)] text-[#0F0F0E] hover:bg-[rgba(15,15,14,0.04)]"
                : "cursor-not-allowed border-[rgba(15,15,14,0.06)] text-[#7A7870]"
            )}
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            <Wallet className="size-4" />
            Withdraw
            {!canWithdraw && (
              <span className="text-xs">(Min $20)</span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="rounded-[14px] border bg-white p-5"
          style={{ borderColor: "rgba(15,15,14,0.08)" }}
        >
          <p
            className="text-sm font-medium text-[#7A7870]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Total Earnings
          </p>
          <p
            className="mt-2 text-2xl font-semibold text-[#0F0F0E]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            ${totalEarnings.toFixed(2)}
          </p>
        </div>

        <div
          className="rounded-[14px] border bg-white p-5"
          style={{ borderColor: "rgba(15,15,14,0.08)" }}
        >
          <p
            className="text-sm font-medium text-[#7A7870]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Wallet Balance
          </p>
          <p
            className="mt-2 text-2xl font-semibold text-[#0F0F0E]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            ${walletBalance.toFixed(2)}
          </p>
        </div>

        <div
          className="rounded-[14px] border bg-white p-5"
          style={{ borderColor: "rgba(15,15,14,0.08)" }}
        >
          <p
            className="text-sm font-medium text-[#7A7870]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Skills
          </p>
          <p
            className="mt-2 text-2xl font-semibold text-[#0F0F0E]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            {skillsCount}
          </p>
        </div>

        <div
          className="rounded-[14px] border bg-white p-5"
          style={{ borderColor: "rgba(15,15,14,0.08)" }}
        >
          <p
            className="text-sm font-medium text-[#7A7870]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Total Downloads
          </p>
          <p
            className="mt-2 text-2xl font-semibold text-[#0F0F0E]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            {totalDownloads.toLocaleString()}
          </p>
        </div>
      </div>

      <div
        className="rounded-[14px] border bg-white p-6"
        style={{ borderColor: "rgba(15,15,14,0.08)" }}
      >
        <p
          className="mb-4 text-sm font-semibold text-[#0F0F0E]"
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          Revenue (6 months)
        </p>
        <div className="flex items-end gap-3" style={{ height: 140 }}>
          {chartData.map((bar) => (
            <div
              key={bar.label}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <span
                className="text-[11px] font-medium text-[#7A7870]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                ${bar.revenue > 0 ? bar.revenue.toFixed(0) : "—"}
              </span>
              <div
                className="w-full rounded-t-md bg-[#0F0F0E] transition-all"
                style={{ height: `${bar.height}px` }}
              />
              <span
                className="text-[11px] text-[#7A7870]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <p
            className="text-sm font-semibold text-[#0F0F0E]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            My Skills
          </p>
          <Link
            href="/dashboard/creator/skills/new"
            className="text-sm font-medium text-[#0F0F0E] hover:underline"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            + New Skill
          </Link>
        </div>

        <div
          className="overflow-hidden rounded-[14px] border bg-white"
          style={{ borderColor: "rgba(15,15,14,0.08)" }}
        >
          {skills.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p
                className="text-sm text-[#7A7870]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                No skills yet.{" "}
                <Link
                  href="/dashboard/creator/skills/new"
                  className="font-medium text-[#0F0F0E] underline"
                >
                  Create your first skill
                </Link>
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr
                  className="border-b text-left"
                  style={{ borderColor: "rgba(15,15,14,0.08)" }}
                >
                  <th
                    className="px-5 py-3 text-xs font-medium text-[#7A7870]"
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    Skill
                  </th>
                  <th
                    className="px-5 py-3 text-xs font-medium text-[#7A7870]"
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    Status
                  </th>
                  <th
                    className="px-5 py-3 text-xs font-medium text-[#7A7870]"
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    Downloads
                  </th>
                  <th
                    className="px-5 py-3 text-xs font-medium text-[#7A7870]"
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    Revenue
                  </th>
                  <th
                    className="px-5 py-3 text-xs font-medium text-[#7A7870]"
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr
                    key={skill.id}
                    className="border-b transition-colors hover:bg-[rgba(15,15,14,0.02)]"
                    style={{ borderColor: "rgba(15,15,14,0.04)" }}
                  >
                    <td className="px-5 py-3">
                      <p
                        className="text-sm font-medium text-[#0F0F0E]"
                        style={{ fontFamily: "'Inter Tight', sans-serif" }}
                      >
                        {skill.title}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                          statusBadge(skill.status)
                        )}
                        style={{ fontFamily: "'Inter Tight', sans-serif" }}
                      >
                        {skill.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-sm text-[#3A3A37]"
                        style={{ fontFamily: "'Inter Tight', sans-serif" }}
                      >
                        {skill.downloads.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-sm font-medium text-[#0F0F0E]"
                        style={{ fontFamily: "'Inter Tight', sans-serif" }}
                      >
                        ${(skill.revenue / 100).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/creator/skills/${skill.id}/edit`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#7A7870] transition-colors hover:text-[#0F0F0E]"
                        style={{ fontFamily: "'Inter Tight', sans-serif" }}
                      >
                        Edit
                        <ArrowUpRight className="size-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
