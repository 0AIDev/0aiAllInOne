"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? t("login.error"));
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F6] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-8">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span
                className="inline-grid h-7 w-7 place-items-center rounded-md bg-[#0F0F0E] text-[13px] italic text-white"
                style={{ fontFamily: "'Instrument Serif', serif" }}
                aria-hidden="true"
              >
                <span className="block -translate-y-px">A</span>
              </span>
              <span
                className="text-lg font-bold tracking-tight text-[#0F0F0E]"
              >
                AIStack
              </span>
            </Link>
            <h1
              className="mt-6 text-[clamp(24px,4vw,32px)] font-medium leading-[1.15] tracking-[-0.02em] text-[#0F0F0E]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              {t("login.title")}{" "}
              <em
                className="italic"
                style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
              >
                {t("login.titleEmphasis")}
              </em>
            </h1>
            <p className="mt-2 text-sm text-[#3A3A37]">
              {t("login.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">
                {t("login.emailLabel")}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.emailPlaceholder")}
                className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder:text-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">
                {t("login.passwordLabel")}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("login.passwordPlaceholder")}
                className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder:text-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0F0F0E] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37] disabled:opacity-50"
            >
              {loading ? t("login.signingIn") : t("login.signIn")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#7A7870]">
            {t("login.noAccount")}{" "}
            <Link
              href="/register"
              className="font-medium text-[#0F0F0E] underline underline-offset-4 decoration-[rgba(15,15,14,0.15)] transition-colors hover:text-[#3A3A37]"
            >
              {t("login.signUpLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
