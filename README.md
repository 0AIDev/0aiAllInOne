<div align="center">
  <br/>
  <pre style="font-family: 'Instrument Serif', serif; font-style: italic; font-size: 4rem; letter-spacing: -0.02em; line-height: 1; color: #0F0F0E; background: #F9F9F6; padding: 2rem 0;">
    290+ AI models.
    <em style="font-weight: 400;">One endpoint.</em>
  </pre>
  <br/>

  <p align="center">
    <strong>AIStack</strong> — Universal AI Gateway · Multi-Provider Fallback · Smart Routing · Prompt Compression
  </p>

  <br/>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#i18n">🌐 i18n</a> •
    <a href="#deploy">Deploy</a>
  </p>

  <br/>

  <!-- Replace with actual screenshot -->
  <p align="center">
    <img src="https://placehold.co/1200x630/F9F9F6/0F0F0E?text=AIStack+Landing&font=inter" alt="AIStack Hero" width="90%" style="border-radius: 14px; border: 1px solid rgba(15,15,14,0.08);" />
  </p>

  <br/>

  <p align="center">
    <img src="https://img.shields.io/badge/next.js-15.5-black?style=flat-square" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PRISMA-SQLite-2D3748?style=flat-square" alt="Prisma" />
    <img src="https://img.shields.io/badge/i18n-7%20languages-success?style=flat-square" alt="i18n" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
    <img src="https://img.shields.io/badge/build-60%2F60-brightgreen?style=flat-square" alt="Build" />
  </p>
</div>

<br/>

---

<br/>

## ✦ Overview

**AIStack** is a production-ready, multi-tenant AI Gateway SaaS built with Next.js 15.5. It provides a **unified API endpoint** that connects to over **290 AI providers** with automatic fallback, intelligent routing, prompt compression, and enterprise-grade reliability — all wrapped in a beautiful, minimal interface inspired by TranscriptMagic.

<br/>

<p align="center">
  <img src="https://placehold.co/1000x500/F9F9F6/0F0F0E?text=Dashboard+Preview" alt="Dashboard" width="85%" style="border-radius: 14px; border: 1px solid rgba(15,15,14,0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.04);" />
</p>

<br/>

## ✦ Features

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <strong>⚡ Auto-Fallback</strong><br/>
        <sub>Multi-provider failover in milliseconds. Zero downtime.</sub>
      </td>
      <td align="center" width="33%">
        <strong>🧠 Smart Routing</strong><br/>
        <sub>19 strategies. Set model to "auto" and go.</sub>
      </td>
      <td align="center" width="33%">
        <strong>🗜️ Prompt Compression</strong><br/>
        <sub>RTK + Caveman stacked. Save up to 89% on tokens.</sub>
      </td>
    </tr>
    <tr>
      <td align="center" width="33%">
        <strong>👥 Multi-Tenant</strong><br/>
        <sub>Isolated keys, quotas, billing per customer.</sub>
      </td>
      <td align="center" width="33%">
        <strong>🛡️ Guardrails</strong><br/>
        <sub>PII redaction, injection detection, circuit breakers.</sub>
      </td>
      <td align="center" width="33%">
        <strong>📊 Full Dashboard</strong><br/>
        <sub>Providers, analytics, health, costs — one screen.</sub>
      </td>
    </tr>
  </table>
</div>

<br/>

## ✦ Quick Start

```bash
# 1. Clone & install
git clone https://github.com/0AIDev/0aiAllInOne.git
cd 0aiAllInOne
npm install

# 2. Set up database
npx prisma db push
npx tsx prisma/seed.ts

# 3. Start development
npm run dev
# → http://localhost:3000

# 4. Production build
npm run build
npm start
```

<br/>

<p align="center">
  <img src="https://placehold.co/1000x400/F9F9F6/0F0F0E?text=terminal+animation" alt="Terminal" width="75%" style="border-radius: 14px; border: 1px solid rgba(15,15,14,0.08);" />
</p>

<br/>

## ✦ Architecture

```
src/
├── app/                    # Next.js 15.5 App Router (60 pages)
│   ├── (landing)/          # Home, Features, Pricing, Providers...
│   ├── dashboard/          # Dashboard (Overview, API Keys, Usage...)
│   ├── admin/              # Admin panel (Providers, Revenue, Users...)
│   ├── login/              # Auth pages
│   └── api/                # REST API routes
├── components/
│   ├── landing/            # Hero, Features, Pricing, Combos...
│   ├── dashboard/          # Charts, Tables, Modals...
│   └── layout/             # Navbar, Footer, Admin Sidebar
├── i18n/                   # Custom locale provider (7 languages)
├── lib/                    # Auth (JWT), Prisma client, Utilities
└── messages/               # en/it/fr/de/es/zh/ja JSON translations
```

<br/>

## ✦ i18n — 7 Languages

<p align="center">
  <img src="https://placehold.co/700x60/F9F9F6/0F0F0E?text=🇬🇧+English+🇮🇹+Italiano+🇫🇷+Fran%C3%A7ais+🇩🇪+Deutsch+🇪🇸+Espa%C3%B1ol+🇨🇳+中文+🇯🇵+日本語" alt="Languages" width="90%" />
</p>

Custom `LocaleProvider` with React Context + persistent cookie. No URL prefix rewriting. Switch language from the footer dropdown with flag icons (flag-icons library).

| Language | Code | File |
|---|---|---|
| English | `en` | `messages/en.json` |
| Italiano | `it` | `messages/it.json` |
| Français | `fr` | `messages/fr.json` |
| Deutsch | `de` | `messages/de.json` |
| Español | `es` | `messages/es.json` |
| 中文 | `zh` | `messages/zh.json` |
| 日本語 | `ja` | `messages/ja.json` |

<br/>

<p align="center">
  <img src="https://placehold.co/900x400/F9F9F6/0F0F0E?text=Language+Switcher+Demo" alt="Language Switcher" width="80%" style="border-radius: 14px; border: 1px solid rgba(15,15,14,0.08);" />
</p>

<br/>

## ✦ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15.5 (App Router, Turbopack) |
| **Language** | TypeScript 5.8 |
| **Styling** | Tailwind CSS 4, Squircle (rounded corners) |
| **Database** | SQLite via Prisma ORM |
| **Auth** | bcryptjs + jose (JWT), cookie-based sessions |
| **Charts** | Recharts |
| **Animations** | Lenis (smooth scroll), CSS transitions |
| **Icons** | Lucide React, flag-icons |
| **i18n** | Custom LocaleProvider (React Context + cookie) |

<br/>

## ✦ Screenshots

<!-- Replace placeholders with actual screenshots -->

<table>
  <tr>
    <td width="50%"><img src="https://placehold.co/600x400/F9F9F6/0F0F0E?text=Hero+Section" alt="Hero" style="border-radius: 14px; border: 1px solid rgba(15,15,14,0.08); width: 100%;" /></td>
    <td width="50%"><img src="https://placehold.co/600x400/F9F9F6/0F0F0E?text=Provider+Showcase" alt="Providers" style="border-radius: 14px; border: 1px solid rgba(15,15,14,0.08); width: 100%;" /></td>
  </tr>
  <tr>
    <td width="50%"><img src="https://placehold.co/600x400/F9F9F6/0F0F0E?text=Pricing+Section" alt="Pricing" style="border-radius: 14px; border: 1px solid rgba(15,15,14,0.08); width: 100%;" /></td>
    <td width="50%"><img src="https://placehold.co/600x400/F9F9F6/0F0F0E?text=Dashboard" alt="Dashboard" style="border-radius: 14px; border: 1px solid rgba(15,15,14,0.08); width: 100%;" /></td>
  </tr>
</table>

<br/>

## ✦ Deploy

```bash
npm run build  # 60/60 pages, 0 errors
npm start
```

<br/>

---

<div align="center">
  <sub>Built with ❤️ by 0AI Dev · MIT License</sub>
  <br/><br/>
  <sub>
    <a href="https://opencode.ai">opencode</a> ·
    <a href="https://nextjs.org">Next.js</a> ·
    <a href="https://tailwindcss.com">Tailwind CSS</a>
  </sub>
</div>
