"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import {
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";

interface PayoutData {
  id: string;
  amount: number;
  status: string;
  stripePayoutId: string | null;
  processedAt: string | null;
  createdAt: string;
}

interface CreatorPayoutData {
  stripeConnectId: string | null;
  stripeConnectVerified: boolean;
  walletBalance: number;
  recentPayouts: PayoutData[];
}

function statusIcon(status: string) {
  switch (status) {
    case "PAID":
      return <CheckCircle2 className="size-4 text-emerald-500" />;
    case "FAILED":
      return <XCircle className="size-4 text-red-500" />;
    case "PROCESSING":
      return <Loader2 className="size-4 animate-spin text-amber-500" />;
    default:
      return <Clock className="size-4 text-[#7A7870]" />;
  }
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "FAILED":
      return "bg-red-50 text-red-700 border-red-200";
    case "PROCESSING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-50 text-gray-500 border-gray-200";
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CreatorPayoutsPage() {

  const [data, setData] = useState<CreatorPayoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stripeConnectId, setStripeConnectId] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/creator/payouts");
      if (!res.ok) throw new Error("Failed to load payout data");
      const json = await res.json();
      setData(json);
      if (json.stripeConnectId) {
        setStripeConnectId(json.stripeConnectId);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load payout data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConnect = useCallback(async () => {
    if (!stripeConnectId.trim()) return;
    setConnecting(true);
    setError(null);
    setPayoutMessage(null);
    try {
      const res = await fetch("/api/creator/stripe-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeConnectId: stripeConnectId.trim() }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to connect Stripe");
      }
      fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect Stripe"
      );
    } finally {
      setConnecting(false);
    }
  }, [stripeConnectId, fetchData]);

  const handleRequestPayout = useCallback(async () => {
    setRequestingPayout(true);
    setError(null);
    setPayoutMessage(null);
    try {
      const res = await fetch("/api/creator/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to request payout");
      }
      const json = await res.json();
      setPayoutMessage(json.message || "Payout requested successfully");
      fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to request payout"
      );
    } finally {
      setRequestingPayout(false);
    }
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="size-8 animate-spin rounded-full border-2 border-[#0F0F0E] border-t-transparent" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  const isConnected = data?.stripeConnectVerified ?? false;

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {payoutMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {payoutMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div
          className="rounded-[14px] border bg-white p-6"
          style={{ borderColor: "rgba(15,15,14,0.08)" }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full",
                isConnected ? "bg-emerald-50" : "bg-amber-50"
              )}
            >
              {isConnected ? (
                <CheckCircle2 className="size-5 text-emerald-600" />
              ) : (
                <Wallet className="size-5 text-amber-600" />
              )}
            </div>
            <div>
              <p
                className="text-sm font-semibold text-[#0F0F0E]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                Stripe Connect
              </p>
              <p
                className="text-xs text-[#7A7870]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                {isConnected ? "Connected" : "Not connected"}
              </p>
            </div>
          </div>

          {!isConnected ? (
            <div className="space-y-4">
              <div
                className="rounded-lg border p-4"
                style={{ borderColor: "rgba(15,15,14,0.08)" }}
              >
                <p
                  className="text-sm font-medium text-[#0F0F0E]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  Revenue Split
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="text-lg font-semibold text-[#0F0F0E]"
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    80%
                  </span>
                  <span
                    className="text-sm text-[#7A7870]"
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    you
                  </span>
                  <span className="text-sm text-[#7A7870]">/</span>
                  <span
                    className="text-sm text-[#7A7870]"
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    20% platform
                  </span>
                </div>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-[#0F0F0E]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  Stripe Connect ID
                </label>
                <input
                  type="text"
                  value={stripeConnectId}
                  onChange={(e) => setStripeConnectId(e.target.value)}
                  placeholder="acct_..."
                  className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#0F0F0E] placeholder-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E]"
                  style={{
                    borderColor: "rgba(15,15,14,0.08)",
                    fontFamily: "'Inter Tight', sans-serif",
                  }}
                />
              </div>

              <button
                onClick={handleConnect}
                disabled={connecting || !stripeConnectId.trim()}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-opacity",
                  connecting || !stripeConnectId.trim()
                    ? "cursor-not-allowed bg-[#7A7870]"
                    : "bg-[#0F0F0E] hover:opacity-90"
                )}
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                {connecting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect with Stripe"
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className="rounded-lg border p-4"
                style={{ borderColor: "rgba(15,15,14,0.08)" }}
              >
                <p
                  className="text-sm text-[#7A7870]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  Wallet Balance
                </p>
                <p
                  className="mt-1 text-2xl font-semibold text-[#0F0F0E]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  ${(data?.walletBalance ?? 0).toFixed(2)}
                </p>
              </div>

              <button
                onClick={handleRequestPayout}
                disabled={
                  requestingPayout || (data?.walletBalance ?? 0) < 20
                }
                title={
                  (data?.walletBalance ?? 0) < 20
                    ? "Minimum $20 to withdraw"
                    : undefined
                }
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-opacity",
                  requestingPayout || (data?.walletBalance ?? 0) < 20
                    ? "cursor-not-allowed bg-[#7A7870]"
                    : "bg-[#0F0F0E] hover:opacity-90"
                )}
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                {requestingPayout ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="size-4" />
                    Request Payout
                    {(data?.walletBalance ?? 0) < 20 && (
                      <span className="text-xs opacity-75">
                        (Min $20)
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div
          className="rounded-[14px] border bg-white p-6"
          style={{ borderColor: "rgba(15,15,14,0.08)" }}
        >
          <p
            className="mb-4 text-sm font-semibold text-[#0F0F0E]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Recent Payouts
          </p>

          {(!data?.recentPayouts || data.recentPayouts.length === 0) ? (
            <p
              className="py-8 text-center text-sm text-[#7A7870]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              No payouts yet
            </p>
          ) : (
            <div className="space-y-3">
              {data.recentPayouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                  style={{ borderColor: "rgba(15,15,14,0.06)" }}
                >
                  <div className="flex items-center gap-3">
                    {statusIcon(payout.status)}
                    <div>
                      <p
                        className="text-sm font-medium text-[#0F0F0E]"
                        style={{
                          fontFamily: "'Inter Tight', sans-serif",
                        }}
                      >
                        ${(payout.amount / 100).toFixed(2)}
                      </p>
                      <p
                        className="text-xs text-[#7A7870]"
                        style={{
                          fontFamily: "'Inter Tight', sans-serif",
                        }}
                      >
                        {formatDate(payout.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                      statusBadgeClass(payout.status)
                    )}
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    {payout.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
