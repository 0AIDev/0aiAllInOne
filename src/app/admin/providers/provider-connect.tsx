"use client";

import { useState } from "react";

export function ProviderRow(props: { slug: string; name: string; domain: string; connected: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    label: "",
    apiKey: "",
    baseUrl: "",
    region: "",
    engineId: "",
    userAgent: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleConnect() {
    if (!form.apiKey.trim()) return;
    setSaving(true);
    setError("");
    try {
      const body: Record<string, unknown> = { apiKey: form.apiKey, label: form.label || form.apiKey.slice(0, 12) };
      if (form.baseUrl) body.baseUrl = form.baseUrl;
      if (form.region) body.region = form.region;
      if (form.engineId) body.engineId = form.engineId;
      if (form.userAgent) body.userAgent = form.userAgent;

      const res = await fetch(`/api/admin/providers/${props.slug}/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to connect");
      }
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[rgba(15,15,14,0.03)]">
        <img
          src={`https://www.google.com/s2/favicons?domain=${props.domain}&sz=32`}
          alt={props.name}
          className="h-[18px] w-[18px] shrink-0 rounded object-contain"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[#0F0F0E]">{props.name}</p>
        </div>
        {props.connected ? (
          <span className="shrink-0 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-medium text-[#15803D]">
            Connected
          </span>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0F0F0E] text-white opacity-0 transition-all hover:bg-[#3A3A37] group-hover:opacity-100"
            title={`Connect ${props.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-medium text-[#0F0F0E]">Connect {props.name}</h3>
              <button onClick={() => setShowModal(false)} className="text-[#7A7870] hover:text-[#0F0F0E]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">Connection Name</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder={`${props.name} Primary`}
                  className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder:text-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">API Key</label>
                <input
                  type="text"
                  value={form.apiKey}
                  onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                  placeholder="sk-..."
                  className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder:text-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">Base URL Override</label>
                <input
                  type="text"
                  value={form.baseUrl}
                  onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
                  placeholder="https://api.example.com/v1"
                  className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder:text-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
                />
                <p className="mt-1 text-[11px] text-[#7A7870]">Optional. Stored as providerSpecificData.baseUrl.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">Region</label>
                  <input
                    type="text"
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    placeholder="us-east-1"
                    className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder:text-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">Search CX/Engine ID</label>
                  <input
                    type="text"
                    value={form.engineId}
                    onChange={(e) => setForm({ ...form, engineId: e.target.value })}
                    placeholder="Optional provider-specific ID"
                    className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder:text-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">Custom User Agent</label>
                <input
                  type="text"
                  value={form.userAgent}
                  onChange={(e) => setForm({ ...form, userAgent: e.target.value })}
                  placeholder="Optional"
                  className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder:text-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-white px-4 py-2.5 text-sm font-medium text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.03)]">
                Cancel
              </button>
              <button onClick={handleConnect} disabled={saving || !form.apiKey.trim()} className="flex-1 rounded-[10px] bg-[#0F0F0E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37] disabled:opacity-50">
                {saving ? "Connecting..." : "Connect"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
