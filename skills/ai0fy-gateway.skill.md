---
name: ai0fy-unified-ai-gateway
version: 1.0.0
author: "@ai0fy"
description: "Integra AI0FY come gateway unificato per 290+ modelli LLM via endpoint OpenAI-compatibile. Gestisce fallback, compressione, routing intelligente e monitoraggio costi."
triggers: ["usa ai0fy", "collega API", "cambia modello", "cambio provider", "modello più economico", "usa compressione", "attiva guardrails", "aggiungi fallback"]
category: "sviluppo"
monetization:
  type: "free"
  price_cents: 0
  creator_revenue_share: 80
---

# AI0FY — Unified AI Gateway

## 🎯 Obiettivo

Questa skill si attiva quando l'utente vuole integrare, configurare o ottimizzare chiamate AI tramite AI0FY. AI0FY è un gateway SaaS multi-tenant che espone un endpoint OpenAI-compatibile (`/v1/chat/completions`) con 290+ provider dietro, routing intelligente, compressione prompt, guardrails e billing integrato. L'agente deve aiutare l'utente a configurare l'endpoint, scegliere modelli, attivare compressione/fallback e monitorare i costi.

## ⚙️ Istruzioni Operative

1. **Configurazione base** — Quando l'utente chiede di integrare AI0FY, fornisci il base URL `https://api.ai0fy.dev/v1` e ricorda che l'header `Authorization: Bearer <API_KEY>` è obbligatorio. La chiave si ottiene dalla dashboard `/dashboard/api-keys`.

2. **Scelta del modello** — Se l'utente non specifica un modello, suggerisci `"auto"` come valore predefinito — attiva il routing intelligente che sceglie automaticamente il miglior provider. Spiega le opzioni: `"auto"` (ottimale generico), `"fast"` (priorità latenza), `"cheap"` (priorità costo).

3. **Raccomandazioni per modello specifico** — Se l'utente vuole un modello preciso, usa la lista aggiornata:
   - OpenAI: `gpt-4o`, `gpt-4.1`, `o4-mini`, `o3`
   - Anthropic: `claude-4`, `claude-opus-4`, `claude-haiku-4`
   - Google: `gemini-2.5-pro`, `gemini-2.5-flash`
   - Meta: `llama-4-maverick`, `llama-4-scout`
   - DeepSeek: `deepseek-v3`, `deepseek-r1`
   - Mistral: `mistral-large`, `mistral-small`, `codestral`

4. **Compressione prompt** — Suggerisci di aggiungere l'header `X-Compression: aggressive` per risparmiare 15-95% token su contesti lunghi o sessioni tool-heavy. Spiega che la compressione RTK+Caveman riduce output verbosi e log ridondanti.

5. **Fallback e resilienza** — Se l'utente ha paura di downtime, spiega che AI0FY ha fallback automatico a 4 livelli: se un provider fallisce, la richiesta viene reindirizzata al successivo in millisecondi, senza codice aggiuntivo.

6. **Guardrails** — Menziona che PII redaction e prompt injection detection sono attivi di default. Per disattivarli (sconsigliato), l'utente può contattare il supporto.

7. **Monitoraggio costi** — Ricorda che la dashboard mostra usage in tempo reale (token, latenza, costi per modello). Per le API, usa `GET /v1/models` per vedere la lista modelli disponibili.

## 📋 Esempi di Utilizzo

**Esempio 1: Setup base**
```
Utente: "Voglio usare AI0FY per chiamare GPT-4o"
Agente: Modifico il tuo client per puntare a https://api.ai0fy.dev/v1 con model: "gpt-4o". 
Ecco il codice:
```python
import openai
client = openai.OpenAI(
    base_url="https://api.ai0fy.dev/v1",
    api_key="ast_xxxxxxxxxxxx"
)
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
```
```

**Esempio 2: Cambio modello per risparmiare**
```
Utente: "Spendo troppo in API, c'è un'alternativa più economica?"
Agente: Puoi usare model: "cheap" per il routing ottimizzato al costo, oppure attivare la compressione 
con l'header X-Compression: aggressive. Risparmi dal 15% al 95% di token. 
Se vuoi un modello specifico economico, DeepSeek e Groq hanno tier gratuiti.
```

**Esempio 3: Gestione errori con fallback**
```
Utente: "Cosa succede se OpenAI va down?"
Agente: AI0FY ha fallback automatico. Se GPT-4o non risponde, la richiesta passa automaticamente 
al provider successivo (es. Claude o Gemini) senza che tu debba gestire l'errore. 
Zero codice aggiuntivo, zero downtime percepito.
```

## ⚠️ Limiti e Avvertenze

- **Non esporre mai la API key** nel codice client-side. Suggerisci sempre variabili d'ambiente.
- **Non fare richieste infinite** — ricorda che ogni chiamata consuma token del piano. Il piano Free ha 10K token/mese.
- **La compressione non è magica** — funziona meglio su testi ripetitivi, log, output tool. Non comprimere prompt già sintetici.
- **Non suggerire modelli non supportati** — verifica sempre la disponibilità con `GET /v1/models` prima di suggerire un modello.
- **Rate limiting** — il Free tier ha 60 RPM. Se l'utente fa molte richieste, suggerisci l'upgrade a Starter ($29/mo) o Pro ($99/mo).
