"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";

function RegisterForm() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setForm((prev) => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? t("register.error"));
      }
      router.push("/onboarding");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("register.error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(provider: string) {
    setError("");
    setLoading(true);
    try {
      // Placeholder — social login would redirect to the provider's OAuth flow
      const res = await fetch(`/api/auth/${provider}`, { method: "POST" });
      if (!res.ok) throw new Error(t("register.error"));
      router.push("/onboarding");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("register.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F6] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-8">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span
                className="inline-grid h-7 w-7 place-items-center rounded-md bg-[#0F0F0E] text-[13px] italic text-white"
                style={{ fontFamily: "'Instrument Serif', serif" }}
                aria-hidden="true"
              >
                <span className="block -translate-y-px">A</span>
              </span>
              <span className="text-lg font-bold tracking-tight text-[#0F0F0E]">
                AIStack
              </span>
            </Link>
            <h1
              className="mt-6 text-[clamp(24px,4vw,32px)] font-medium leading-[1.15] tracking-[-0.02em] text-[#0F0F0E]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              {t("register.title")}{" "}
              <em className="italic" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
                {t("register.titleEmphasis")}
              </em>
            </h1>
            <p className="mt-2 text-sm text-[#3A3A37]">
              {t("register.subtitle")}
            </p>
          </div>

          {/* Social buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin("github")}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-3 rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-white px-4 py-2.5 text-sm font-medium text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.03)] disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              {t("register.github")}
            </button>
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-3 rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-white px-4 py-2.5 text-sm font-medium text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.03)] disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              {t("register.google")}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(15,15,14,0.08)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-[#7A7870]">{t("register.orDivider")}</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">
                {t("register.nameLabel")}
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder={t("register.namePlaceholder")}
                className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder:text-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">
                {t("register.emailLabel")}
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder={t("register.emailPlaceholder")}
                className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder:text-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">
                {t("register.passwordLabel")}
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder={t("register.passwordPlaceholder")}
                minLength={8}
                className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder:text-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0F0F0E] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37] disabled:opacity-50"
            >
              {loading ? t("register.creatingAccount") : t("register.createAccount")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#7A7870]">
            {t("register.hasAccount")}{" "}
            <Link href="/login" className="font-medium text-[#0F0F0E] underline underline-offset-4 decoration-[rgba(15,15,14,0.15)] transition-colors hover:text-[#3A3A37]">
              {t("register.signInLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
