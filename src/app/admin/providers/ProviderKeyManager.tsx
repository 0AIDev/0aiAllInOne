"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProviderKeyData {
  id: string;
  label: string | null;
  isActive: boolean;
  consecutiveFails: number;
  priority: number;
  createdAt: string;
}

export function ProviderKeyManager({
  providerId,
  keys,
}: {
  providerId: string;
  keys: ProviderKeyData[];
}) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [priority, setPriority] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/providers/${providerId}/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label || null, apiKey, priority }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed");
      }
      setShowAdd(false);
      setLabel("");
      setApiKey("");
      setPriority(0);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add key");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(keyId: string, currentActive: boolean) {
    await fetch(`/api/admin/providers/${providerId}/keys/${keyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentActive }),
    });
    router.refresh();
  }

  async function handleDelete(keyId: string) {
    if (!confirm("Delete this key permanently?")) return;
    await fetch(`/api/admin/providers/${providerId}/keys/${keyId}`, {
      method: "DELETE",
    });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          API Keys ({keys.length})
        </h4>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {showAdd ? "Cancel" : "+ Add Key"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Production key"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Priority</label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1.5 text-xs"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1.5 text-xs font-mono"
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Key"}
          </button>
        </form>
      )}

      {keys.length === 0 && !showAdd && (
        <p className="text-xs text-gray-500 dark:text-gray-400 py-2">
          No keys configured. Add one to enable this provider.
        </p>
      )}

      {keys.map((k) => (
        <div
          key={k.id}
          className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0"
        >
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                k.isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {k.isActive ? "Active" : "Disabled"}
            </span>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {k.label ?? "Unnamed"}
            </span>
            <span className="text-[10px] text-gray-400">Priority: {k.priority}</span>
            {k.consecutiveFails > 0 && (
              <span className="text-[10px] text-red-500">{k.consecutiveFails} fails</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggle(k.id, k.isActive)}
              className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {k.isActive ? "Disable" : "Enable"}
            </button>
            <button
              onClick={() => handleDelete(k.id)}
              className="text-[10px] text-red-600 dark:text-red-400 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
