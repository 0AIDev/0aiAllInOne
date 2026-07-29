"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex shrink-0 items-center gap-2 rounded-[10px] bg-[rgba(15,15,14,0.06)] px-4 py-2 text-xs font-medium text-[#0F0F0E] transition-colors hover:bg-[rgba(15,15,14,0.1)]"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
