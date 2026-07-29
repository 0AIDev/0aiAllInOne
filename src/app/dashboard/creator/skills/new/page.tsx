"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Sparkles, Save, Send, Eye } from "lucide-react";

const categories = [
  { value: "development", label: "Development" },
  { value: "marketing", label: "Marketing" },
  { value: "data_analysis", label: "Data Analysis" },
  { value: "other", label: "Other" },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
}

function generateYamlPreview(
  title: string,
  description: string,
  category: string,
  triggers: string,
  version: string
): string {
  const lines: string[] = [];
  if (title) lines.push(`title: "${title}"`);
  if (description) lines.push(`description: "${description}"`);
  if (category) lines.push(`category: ${category}`);
  if (triggers.trim()) {
    const triggerList = triggers
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (triggerList.length > 0) {
      lines.push(`triggers:`);
      for (const t of triggerList) {
        lines.push(`  - ${t}`);
      }
    }
  }
  lines.push(`version: "${version}"`);

  const yaml = lines.join("\n");
  return `---\n${yaml}\n---`;
}

export default function NewSkillPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("development");
  const [priceCents, setPriceCents] = useState(0);
  const [triggers, setTriggers] = useState("");
  const [content, setContent] = useState("");
  const [version, setVersion] = useState("1.0.0");

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const yamlPreview = generateYamlPreview(
    title,
    description,
    category,
    triggers,
    version
  );

  const handleOptimize = useCallback(async () => {
    if (!content.trim()) return;
    setIsOptimizing(true);
    setError(null);
    try {
      const res = await fetch("/api/creator/skills/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, content, triggers }),
      });
      if (!res.ok) throw new Error("Optimization failed");
      const data = await res.json();
      setContent(data.optimizedContent);
    } catch {
      setError("Failed to optimize. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  }, [title, description, content, triggers]);

  const handleSubmit = useCallback(
    async (status: "DRAFT" | "PUBLISHED") => {
      setIsSaving(true);
      setError(null);
      try {
        const triggerArray = triggers
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        const res = await fetch("/api/creator/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            slug: generateSlug(title),
            description,
            category,
            priceCents,
            triggers: triggerArray,
            content,
            version,
            status,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to save skill");
        }

        router.push("/dashboard/creator");
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to save skill"
        );
      } finally {
        setIsSaving(false);
      }
    },
    [title, description, category, priceCents, triggers, content, version, router]
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-[#0F0F0E]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. React Component Generator"
              className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#0F0F0E] placeholder-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E]"
              style={{
                borderColor: "rgba(15,15,14,0.08)",
                fontFamily: "'Inter Tight', sans-serif",
              }}
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-[#0F0F0E]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this skill does..."
              rows={3}
              className="w-full resize-none rounded-lg border bg-white px-4 py-2.5 text-sm text-[#0F0F0E] placeholder-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E]"
              style={{
                borderColor: "rgba(15,15,14,0.08)",
                fontFamily: "'Inter Tight', sans-serif",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-[#0F0F0E]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#0F0F0E] outline-none transition-colors focus:border-[#0F0F0E]"
                style={{
                  borderColor: "rgba(15,15,14,0.08)",
                  fontFamily: "'Inter Tight', sans-serif",
                }}
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-[#0F0F0E]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                Price (cents)
              </label>
              <input
                type="number"
                value={priceCents}
                onChange={(e) =>
                  setPriceCents(Math.max(0, Number(e.target.value)))
                }
                min={0}
                className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#0F0F0E] outline-none transition-colors focus:border-[#0F0F0E]"
                style={{
                  borderColor: "rgba(15,15,14,0.08)",
                  fontFamily: "'Inter Tight', sans-serif",
                }}
              />
              <p
                className="mt-1 text-xs text-[#7A7870]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                {priceCents === 0 ? "Free" : `$${(priceCents / 100).toFixed(2)}`}
              </p>
            </div>
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-[#0F0F0E]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Triggers
            </label>
            <input
              type="text"
              value={triggers}
              onChange={(e) => setTriggers(e.target.value)}
              placeholder="react component, ui generator, frontend"
              className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#0F0F0E] placeholder-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E]"
              style={{
                borderColor: "rgba(15,15,14,0.08)",
                fontFamily: "'Inter Tight', sans-serif",
              }}
            />
            <p
              className="mt-1 text-xs text-[#7A7870]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Comma-separated keywords that trigger this skill
            </p>
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-[#0F0F0E]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Version
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
              className="w-28 rounded-lg border bg-white px-4 py-2.5 text-sm text-[#0F0F0E] outline-none transition-colors focus:border-[#0F0F0E]"
              style={{
                borderColor: "rgba(15,15,14,0.08)",
                fontFamily: "'Inter Tight', sans-serif",
              }}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                className="text-sm font-medium text-[#0F0F0E]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                Content
              </label>
              <button
                type="button"
                onClick={handleOptimize}
                disabled={isOptimizing || !content.trim()}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  isOptimizing || !content.trim()
                    ? "cursor-not-allowed border-[rgba(15,15,14,0.06)] text-[#7A7870]"
                    : "border-[rgba(15,15,14,0.12)] text-[#0F0F0E] hover:bg-[rgba(15,15,14,0.04)]"
                )}
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                <Sparkles className="size-3" />
                {isOptimizing ? "Optimizing..." : "Optimize with AI"}
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your skill content in markdown..."
              rows={16}
              className="w-full resize-none rounded-lg border bg-white px-4 py-2.5 text-sm text-[#0F0F0E] placeholder-[#7A7870] outline-none transition-colors focus:border-[#0F0F0E]"
              style={{
                borderColor: "rgba(15,15,14,0.08)",
                fontFamily: "'Inter Tight', sans-serif",
              }}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSubmit("DRAFT")}
              disabled={isSaving || !title.trim()}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors",
                isSaving || !title.trim()
                  ? "cursor-not-allowed border-[rgba(15,15,14,0.06)] text-[#7A7870]"
                  : "border-[rgba(15,15,14,0.12)] text-[#0F0F0E] hover:bg-[rgba(15,15,14,0.04)]"
              )}
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              <Save className="size-4" />
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("PUBLISHED")}
              disabled={isSaving || !title.trim()}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-opacity",
                isSaving || !title.trim()
                  ? "cursor-not-allowed bg-[#7A7870]"
                  : "bg-[#0F0F0E] hover:opacity-90"
              )}
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              <Send className="size-4" />
              {isSaving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Eye className="size-4 text-[#7A7870]" />
            <p
              className="text-sm font-semibold text-[#0F0F0E]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Preview
            </p>
          </div>

          <div
            className="rounded-[14px] border bg-white p-5"
            style={{ borderColor: "rgba(15,15,14,0.08)" }}
          >
            <div className="mb-4 rounded-lg bg-[#F5F5F2] p-4">
              <pre
                className="whitespace-pre-wrap text-[13px] leading-relaxed text-[#3A3A37]"
                style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
              >
                {yamlPreview || "# YAML frontmatter will appear here..."}
              </pre>
            </div>

            <div className="rounded-lg border p-4" style={{ borderColor: "rgba(15,15,14,0.08)" }}>
              {content ? (
                <div
                  className="prose prose-sm max-w-none text-[#3A3A37]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-[#3A3A37]">
                    {content}
                  </pre>
                </div>
              ) : (
                <p
                  className="text-sm text-[#7A7870]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  Start typing in the Content editor to see a live preview...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
