"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Copy, Check, Trash2, X, Key, AlertTriangle } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  prefixKey: string;
  status: string;
  createdAt: string;
  lastUsedAt: string | null;
  rpmLimit: number;
  tpdLimit: number;
  allowedModels: string[];
}

interface NewKeyData {
  key: string;
  prefixKey: string;
  name: string;
  rpmLimit?: number;
  tpdLimit?: number;
  budgetLimit?: number;
  budgetUsed?: number;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function ApiKeyManager({ keys }: { keys: ApiKey[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [newKeyData, setNewKeyData] = useState<NewKeyData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRpm, setFormRpm] = useState(60);
  const [formTpd, setFormTpd] = useState(1000000);
  const [formBudget, setFormBudget] = useState(0);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName || undefined,
          rpmLimit: formRpm,
          tpdLimit: formTpd,
          budgetLimit: formBudget,
        }),
      });
      const data = await res.json();
      if (data.key) {
        setNewKeyData(data);
        setShowCreateModal(false);
        setFormName("");
        setFormRpm(60);
        setFormTpd(1000000);
        setFormBudget(0);
        router.refresh();
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    await fetch(`/api/keys/${id}`, { method: "DELETE" });
    setRevokingId(null);
    router.refresh();
  }

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const activeKeys = keys.filter((k) => k.status === "ACTIVE");
  const revokedKeys = keys.filter((k) => k.status !== "ACTIVE");

  return (
    <div className="mt-6 space-y-6">
      {/* New key banner */}
      {newKeyData && (
        <div className="rounded-[14px] border border-[rgba(15,15,14,0.1)] bg-[#0F0F0E] p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/80">
                API key created - copy it now. It won&apos;t be shown again.
              </p>
              <p className="mt-1 text-xs text-white/40">
                {newKeyData.name} · RPM: {newKeyData.rpmLimit ?? 60} · TPD: {formatNumber(newKeyData.tpdLimit ?? 1000000)}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <code className="block w-full break-all rounded-[10px] bg-white/10 px-4 py-2.5 font-mono text-sm text-white">
                  {newKeyData.key}
                </code>
                <button
                  onClick={() => handleCopy(newKeyData.key, "new")}
                  className="shrink-0 rounded-[10px] border border-white/20 bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                >
                  {copiedId === "new" ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setNewKeyData(null);
                setCopiedId(null);
              }}
              className="shrink-0 text-white/50 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Header + Create button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#7A7870]">
            {activeKeys.length} active · {revokedKeys.length} revoked
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#0F0F0E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37]"
        >
          <Plus size={16} />
          Create API Key
        </button>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative z-10 mx-4 w-full max-w-md rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-[#0F0F0E]">Create API Key</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#7A7870] hover:text-[#0F0F0E] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">
                  Key Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Production key"
                  className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder:text-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">
                    RPM Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formRpm}
                    onChange={(e) => setFormRpm(parseInt(e.target.value) || 60)}
                    className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
                  />
                  <p className="mt-1 text-[11px] text-[#7A7870]">Requests/min</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">
                    TPD Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    step={100000}
                    value={formTpd}
                    onChange={(e) => setFormTpd(parseInt(e.target.value) || 1000000)}
                    className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
                  />
                  <p className="mt-1 text-[11px] text-[#7A7870]">Tokens/day</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#3A3A37]">
                  Budget Limit
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={formBudget}
                  onChange={(e) => setFormBudget(parseFloat(e.target.value) || 0)}
                  placeholder="0 = unlimited"
                  className="block w-full rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2.5 text-sm text-[#0F0F0E] outline-none transition-colors focus:border-[#0F0F0E] focus:bg-white focus:ring-3 focus:ring-[rgba(15,15,14,0.06)]"
                />
                <p className="mt-1 text-[11px] text-[#7A7870]">Spend limit (USD)</p>
              </div>
            </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-white px-4 py-2.5 text-sm font-medium text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.03)]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 rounded-[10px] bg-[#0F0F0E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37] disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Key"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      {revokingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setRevokingId(null)}
          />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#0F0F0E]">Revoke API Key</h3>
                <p className="text-sm text-[#7A7870]">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setRevokingId(null)}
                className="flex-1 rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-white px-4 py-2.5 text-sm font-medium text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.03)]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRevoke(revokingId)}
                className="flex-1 rounded-[10px] bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Revoke Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keys Table */}
      {keys.length === 0 ? (
        <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F1EFE9]">
            <Key size={24} className="text-[#7A7870]" />
          </div>
          <h3 className="text-base font-medium text-[#0F0F0E]">No API keys yet</h3>
          <p className="mt-1 text-sm text-[#7A7870]">
            Create your first key to start making API requests.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-[10px] bg-[#0F0F0E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37]"
          >
            <Plus size={16} />
            Create API Key
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F1EFE9]">
                {["Name", "Prefix", "Status", "RPM", "TPD", "Created", "Last Used", ""].map((label, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.08em] text-[#7A7870]"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(15,15,14,0.06)]">
              {keys.map((key) => (
                <tr
                  key={key.id}
                  className="transition-colors hover:bg-[rgba(15,15,14,0.01)]"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#0F0F0E]">{key.name}</p>
                    {key.allowedModels.length > 0 && (
                      <p className="mt-0.5 text-[11px] text-[#7A7870]">
                        {key.allowedModels.length} model{key.allowedModels.length !== 1 ? "s" : ""} allowed
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-[#7A7870]">{key.prefixKey}…</code>
                      <button
                        onClick={() => handleCopy(key.prefixKey, key.id)}
                        className="shrink-0 text-[#7A7870] transition-colors hover:text-[#3A3A37]"
                      >
                        {copiedId === key.id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        key.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          key.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {key.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#3A3A37] tabular-nums">
                    {key.rpmLimit}
                  </td>
                  <td className="px-4 py-3 text-[#3A3A37] tabular-nums">
                    {formatNumber(key.tpdLimit)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#7A7870] whitespace-nowrap">
                    {new Date(key.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#7A7870] whitespace-nowrap">
                    {key.lastUsedAt
                      ? new Date(key.lastUsedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {key.status === "ACTIVE" && (
                      <button
                        onClick={() => setRevokingId(key.id)}
                        className="inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
