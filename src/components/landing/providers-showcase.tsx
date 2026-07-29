"use client";import { useLocale } from "@/i18n/locale-provider";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { ArrowRight } from "lucide-react";

const providers = [
  {
    name: "OpenAI",
    models: ["gpt-4o", "gpt-4.1", "o4-mini", "o3"],
    bg: "bg-white",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" strokeLinejoin="round" viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
        <path d="M14.9449 6.54871C15.3128 5.45919 15.1861 4.26567 14.5978 3.27464C13.7131 1.75461 11.9345 0.972595 10.1974 1.3406C9.42464 0.481584 8.3144 -0.00692594 7.15045 7.42132e-05C5.37487 -0.00392587 3.79946 1.1241 3.2532 2.79113C2.11256 3.02164 1.12799 3.72615 0.551837 4.72468C-0.339497 6.24071 -0.1363 8.15175 1.05451 9.45178C0.686626 10.5413 0.813308 11.7348 1.40162 12.7258C2.28637 14.2459 4.06498 15.0279 5.80204 14.6599C6.5743 15.5189 7.68504 16.0074 8.849 15.9999C10.6256 16.0044 12.2015 14.8754 12.7478 13.2069C13.8884 12.9764 14.873 12.2718 15.4491 11.2733C16.3394 9.75728 16.1357 7.84774 14.9454 6.54771L14.9449 6.54871ZM8.85001 14.9544C8.13907 14.9554 7.45043 14.7099 6.90468 14.2604C6.92951 14.2474 6.97259 14.2239 7.00046 14.2069L10.2293 12.3668C10.3945 12.2743 10.4959 12.1008 10.4949 11.9133V7.42173L11.8595 8.19925C11.8742 8.20625 11.8838 8.22025 11.8858 8.23625V11.9558C11.8838 13.6099 10.5263 14.9509 8.85001 14.9544ZM2.32133 12.2028C1.9651 11.5958 1.8369 10.8843 1.95902 10.1938C1.98284 10.2078 2.02489 10.2333 2.05479 10.2503L5.28366 12.0903C5.44733 12.1848 5.65003 12.1848 5.81421 12.0903L9.75604 9.84429V11.3993C9.75705 11.4153 9.74945 11.4308 9.73678 11.4408L6.47295 13.3004C5.01915 14.1264 3.1625 13.6354 2.32184 12.2028H2.32133ZM1.47155 5.24819C1.82626 4.64017 2.38619 4.17516 3.05305 3.93366C3.05305 3.96116 3.05152 4.00966 3.05152 4.04366V7.72424C3.05051 7.91124 3.15186 8.08475 3.31654 8.17725L7.25838 10.4228L5.89376 11.2003C5.88008 11.2093 5.86285 11.2108 5.84765 11.2043L2.58331 9.34327C1.13255 8.51426 0.63494 6.68272 1.47104 5.24869L1.47155 5.24819ZM12.6834 7.82274L8.74157 5.57669L10.1062 4.79968C10.1199 4.79068 10.1371 4.78918 10.1523 4.79568L13.4166 6.65522C14.8699 7.48373 15.3681 9.31827 14.5284 10.7523C14.1732 11.3593 13.6138 11.8243 12.9474 12.0663V8.27575C12.9489 8.08875 12.8481 7.91574 12.6839 7.82274H12.6834ZM14.0414 5.8057C14.0176 5.7912 13.9756 5.7662 13.9457 5.7492L10.7168 3.90916C10.5531 3.81466 10.3504 3.81466 10.1863 3.90916L6.24442 6.15521V4.60017C6.2434 4.58417 6.251 4.56867 6.26367 4.55867L9.52751 2.70063C10.9813 1.87311 12.84 2.36563 13.6781 3.80066C14.0323 4.40667 14.1605 5.11618 14.0404 5.8057H14.0414ZM5.50257 8.57726L4.13744 7.79974C4.12275 7.79274 4.11312 7.77874 4.11109 7.76274V4.04316C4.11211 2.38713 5.47368 1.0451 7.15197 1.0461C7.86189 1.0461 8.54902 1.2921 9.09476 1.74011C9.06993 1.75311 9.02737 1.77661 8.99899 1.79361L5.77012 3.63365C5.60493 3.72615 5.50358 3.89916 5.50459 4.08666L5.50257 8.57626V8.57726ZM6.24391 7.00022L7.99972 5.9997L9.75553 6.99972V9.00027L7.99972 10.0003L6.24391 9.00027V7.00022Z" />
      </svg>
    ),
  },
  {
    name: "Anthropic",
    models: ["claude-4", "claude-opus-4", "claude-haiku-4"],
    bg: "bg-transparent",
    icon: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
        <title>Claude</title>
        <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" fill="#D97757" fillRule="nonzero" />
      </svg>
    ),
  },
  {
    name: "Google Gemini",
    models: ["gemini-2.5-pro", "gemini-2.5-flash"],
    bg: "bg-white",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        <path d="M1 1h22v22H1z" fill="none" />
      </svg>
    ),
  },
  {
    name: "Meta Llama",
    models: ["llama-4-maverick", "llama-4-scout"],
    bg: "bg-transparent",
    icon: (
      <svg viewBox="0 0 310 126" className="h-4 w-6" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mg1a" x1="61" y1="117" x2="259" y2="127" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0064e1" offset="0" /><stop stopColor="#0064e1" offset="0.4" /><stop stopColor="#0073ee" offset="0.83" /><stop stopColor="#0082fb" offset="1" />
          </linearGradient>
          <linearGradient id="mg2a" x1="45" y1="139" x2="45" y2="66" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0082fb" offset="0" /><stop stopColor="#0064e0" offset="1" />
          </linearGradient>
        </defs>
        <path d="M31.06 125.96c0 10.98 2.41 19.41 5.56 24.51 4.13 6.68 10.29 9.51 16.57 9.51 8.1 0 15.51-2.01 29.79-21.76 11.44-15.83 24.92-38.05 33.99-51.98l15.36-23.6c10.67-16.39 23.02-34.61 37.18-46.96C181.07 5.6 193.54 0 206.09 0c21.07 0 41.14 12.21 56.5 35.11 16.81 25.08 24.97 56.67 24.97 89.27 0 19.38-3.82 33.62-10.32 44.87-6.28 10.88-18.52 21.75-39.11 21.75v-31.02c17.63 0 22.03-16.2 22.03-34.74 0-26.42-6.16-55.74-19.73-76.69-9.63-14.86-22.11-23.94-35.84-23.94-14.85 0-26.8 11.2-40.23 31.17-7.14 10.61-14.47 23.54-22.7 38.13l-9.06 16.05c-18.2 32.27-22.81 39.62-31.91 51.75-15.95 21.24-29.57 29.29-47.5 29.29-21.27 0-34.72-9.21-43.05-23.09-6.8-11.31-10.14-26.15-10.14-43.06z" fill="#0081fb" />
        <path d="M24.49 37.3C38.73 15.35 59.28 0 82.85 0c13.65 0 27.22 4.04 41.39 15.61 15.5 12.65 32.02 33.48 52.63 67.81l7.39 12.32c17.84 29.72 27.99 45.01 33.93 52.22 7.64 9.26 12.99 12.02 19.94 12.02 17.63 0 22.03-16.2 22.03-34.74l27.4-.86c0 19.38-3.82 33.62-10.32 44.87-6.28 10.88-18.52 21.75-39.11 21.75-12.8 0-24.14-2.78-36.68-14.61-9.64-9.08-20.91-25.21-29.58-39.71l-25.79-43.08c-12.94-21.62-24.81-37.74-31.68-45.04-7.39-7.85-16.89-17.33-32.05-17.33-12.27 0-22.69 8.61-31.41 21.78z" fill="url(#mg1a)" />
        <path d="M82.35 31.23c-12.27 0-22.69 8.61-31.41 21.78-12.33 18.61-19.88 46.33-19.88 72.95 0 10.98 2.41 19.41 5.56 24.51l-26.48 17.44C3.34 156.6 0 141.76 0 124.85c0-30.75 8.44-62.8 24.49-87.55C38.73 15.35 59.28 0 82.85 0z" fill="url(#mg2a)" />
      </svg>
    ),
  },
  {
    name: "Mistral",
    models: ["mistral-large", "mistral-small", "codestral"],
    bg: "bg-transparent",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
        <title>Mistral</title>
        <path d="M3.428 3.4h3.429v3.428H3.428V3.4zm13.714 0h3.43v3.428h-3.43V3.4z" fill="gold" />
        <path d="M3.428 6.828h6.857v3.429H3.429V6.828zm10.286 0h6.857v3.429h-6.857V6.828z" fill="#FFAF00" />
        <path d="M3.428 10.258h17.144v3.428H3.428v-3.428z" fill="#FF8205" />
        <path d="M3.428 13.686h3.429v3.428H3.428v-3.428zm6.858 0h3.429v3.428h-3.429v-3.428zm6.856 0h3.43v3.428h-3.43v-3.428z" fill="#FA500F" />
        <path d="M0 17.114h10.286v3.429H0v-3.429zm13.714 0H24v3.429H13.714v-3.429z" fill="#E10500" />
      </svg>
    ),
  },
  {
    name: "DeepSeek",
    models: ["deepseek-v3", "deepseek-r1"],
    bg: "bg-white",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z" fill="#4D6BFE" />
      </svg>
    ),
  },
  {
    name: "Groq",
    models: ["llama-3.3-70b", "mixtral-8x7b"],
    bg: "bg-transparent",
    icon: (
      <svg fill="#F97316" fillRule="evenodd" viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
        <title>Groq</title>
        <path d="M12.036 2c-3.853-.035-7 3-7.036 6.781-.035 3.782 3.055 6.872 6.908 6.907h2.42v-2.566h-2.292c-2.407.028-4.38-1.866-4.408-4.23-.029-2.362 1.901-4.298 4.308-4.326h.1c2.407 0 4.358 1.915 4.365 4.278v6.305c0 2.342-1.944 4.25-4.323 4.279a4.375 4.375 0 01-3.033-1.252l-1.851 1.818A7 7 0 0012.029 22h.092c3.803-.056 6.858-3.083 6.879-6.816v-6.5C18.907 4.963 15.817 2 12.036 2z" />
      </svg>
    ),
  },
  {
    name: "Cohere",
    models: ["command-r-plus", "command-r"],
    bg: "bg-white",
    icon: (
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M6.32 11.908c.525 0 1.57-.03 3.013-.639 1.682-.71 5.03-1.999 7.444-3.323C18.465 7.02 19.205 5.795 19.205 4.145c0-2.29-1.81-4.145-4.043-4.145H5.807C2.6 0 0 2.666 0 5.954c0 3.288 2.434 5.954 6.32 5.954z" fill="#39594D" />
        <path fillRule="evenodd" clipRule="evenodd" d="M7.902 16.011c0-1.612.947-3.065 2.4-3.683l2.945-1.254c2.98-1.268 6.26.977 6.26 4.285 0 2.563-2.027 4.641-4.527 4.64l-3.19-.001c-2.147 0-3.888-1.785-3.888-3.987z" fill="#D18EE2" />
        <path d="M3.348 12.691C1.5 12.691 0 14.228 0 16.124v.444c0 1.896 1.499 3.432 3.348 3.432 1.848 0 3.347-1.536 3.347-3.432v-.444c0-1.896-1.499-3.433-3.347-3.433z" fill="#FF7759" />
      </svg>
    ),
  },
];

const moreProviders = [
  { name: "NVIDIA NIM", domain: "nvidia.com" },
  { name: "Cerebras", domain: "cerebras.ai" },
  { name: "xAI Grok", domain: "x.ai" },
  { name: "Perplexity", domain: "perplexity.ai" },
  { name: "Together AI", domain: "together.ai" },
  { name: "Fireworks AI", domain: "fireworks.ai" },
  { name: "AI21 Labs", domain: "ai21.com" },
  { name: "Baidu ERNIE", domain: "baidu.com" },
  { name: "Alibaba Qwen", domain: "alibaba.com" },
  { name: "Moonshot Kimi", domain: "moonshot.ai" },
  { name: "Minimax", domain: "minimax.io" },
  { name: "DeepInfra", domain: "deepinfra.com" },
  { name: "Hyperbolic", domain: "hyperbolic.xyz" },
  { name: "SambaNova", domain: "sambanova.ai" },
  { name: "Scaleway AI", domain: "scaleway.com" },
  { name: "Novita AI", domain: "novita.ai" },
  { name: "SiliconFlow", domain: "siliconflow.cn" },
  { name: "Cloudflare Workers AI", domain: "cloudflare.com" },
  { name: "Voyage AI", domain: "voyageai.com" },
];

function ProviderCard({ provider, index }: { provider: (typeof providers)[number]; index: number }) {
  const { ref, isVisible } = useScrollReveal();
  const isLightBg = provider.bg.includes("white") || provider.bg.includes("[#F");

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 transition-all duration-500",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
          isLightBg ? "text-[#0F0F0E]" : "text-white",
          provider.bg
        )}
      >
        <div className="h-4 w-4">{provider.icon}</div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[#0F0F0E] leading-tight">
          {provider.name}
        </p>
        <p className="text-[10px] text-[#7A7870] leading-tight truncate">
          {provider.models.slice(0, 2).join(", ")}
        </p>
      </div>
    </div>
  );
}

export function ProvidersShowcase() {
  const { t } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const { ref: labelRef, isVisible: labelVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal();

  return (
    <section className="border-t border-b border-[rgba(15,15,14,0.08)] bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          ref={labelRef}
          className={cn(
            "text-center text-xs font-medium uppercase tracking-[0.15em] text-[#7A7870] transition-all duration-700",
            labelVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          {t("providers.tag")}
        </p>

        {/* Main provider grid */}
        <div
          ref={gridRef}
          className={cn(
            "mt-10 flex flex-wrap items-start justify-center gap-x-8 gap-y-6 transition-all duration-700 delay-100 sm:gap-x-14",
            gridVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {providers.map((provider, i) => (
            <ProviderCard key={provider.name} provider={provider} index={i} />
          ))}
        </div>

        {/* Expanded more providers */}
        {expanded && (
          <div className="mt-6 animate-[fadeInUp_0.4s_ease_forwards]">
            <div className="mx-auto max-w-3xl rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                {moreProviders.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-medium text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.03)]"
                  >
                    <Image
                      src={`https://www.google.com/s2/favicons?domain=${p.domain}&sz=32`}
                      alt={p.name}
                      width={14}
                      height={14}
                      className="h-3.5 w-3.5 shrink-0 object-contain"
                      unoptimized
                    />
                    {p.name}
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-[rgba(15,15,14,0.06)] pt-4 text-center">
                <Link
                  href="/providers"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F0F0E] underline underline-offset-4 decoration-[rgba(15,15,14,0.15)] transition-colors hover:text-[#3A3A37]"
                >
                  {t("providers.viewAll")}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Show more toggle */}
        <div
          className={cn(
            "mt-6 text-center transition-all duration-700 delay-200",
            gridVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7A7870] underline underline-offset-4 decoration-[rgba(15,15,14,0.15)] transition-colors hover:text-[#3A3A37]"
            >
              {t("providers.moreProviders").replace("{n}", moreProviders.length.toString())}
            </button>
          ) : (
            <button
              onClick={() => setExpanded(false)}
              className="text-xs font-medium text-[#7A7870] underline underline-offset-4 decoration-[rgba(15,15,14,0.15)] transition-colors hover:text-[#3A3A37]"
            >
              {t("providers.showLess")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
