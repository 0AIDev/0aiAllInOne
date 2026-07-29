import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Providers - AIStack",
  description: "290+ AI providers through one unified API endpoint. Browse, search, and connect.",
};

const providers = [
  { name: "360 AI", slug: "360ai", category: "China", domain: "ai.360.cn", desc: "Chinese AI platform offering chat, reasoning, and multimodal models powered by 360's proprietary LLMs." },
  { name: "AgentRouter", slug: "agentrouter", category: "Router", domain: "agentrouter.org", desc: "Multi-provider AI aggregator with $200 free credits. Routes to 50+ models through a single API." },
  { name: "AI/ML API", slug: "aimlapi", category: "Aggregator", domain: "aimlapi.com", desc: "Pay-as-you-go AI aggregator providing access to 200+ models across major providers." },
  { name: "AI21 Labs", slug: "ai21", category: "LLM", domain: "ai21.com", desc: "Enterprise-grade language models including Jamba, with $10 trial credits and strong reasoning capabilities." },
  { name: "Alibaba Cloud", slug: "alibaba", category: "Cloud", domain: "alibabacloud.com", desc: "Alibaba's cloud AI platform featuring the Qwen family of models for chat, code, and multimodal tasks." },
  { name: "Amazon Bedrock", slug: "bedrock", category: "Cloud", domain: "aws.amazon.com", desc: "AWS managed service providing access to foundation models from AI21, Anthropic, Cohere, Meta, Mistral, and Stability AI." },
  { name: "Anthropic (Claude)", slug: "anthropic", category: "LLM", domain: "anthropic.com", desc: "Creator of Claude - safety-focused frontier models with strong reasoning, coding, and long-context capabilities." },
  { name: "Api.airforce", slug: "api-airforce", category: "Free", domain: "api.airforce", desc: "Free OpenAI-compatible API gateway with access to multiple open-source and commercial models." },
  { name: "Arcee AI", slug: "arcee-ai", category: "LLM", domain: "arcee.ai", desc: "Specialized small language models optimized for domain-specific enterprise tasks and fine-tuning." },
  { name: "Azure OpenAI", slug: "azure-openai", category: "Cloud", domain: "azure.microsoft.com", desc: "Microsoft's enterprise-grade OpenAI service with compliance, security, and regional deployment options." },
  { name: "Baichuan", slug: "baichuan", category: "China", domain: "baichuan-ai.com", desc: "Leading Chinese AI company offering Baichuan series models with strong Chinese language performance." },
  { name: "Baidu (ERNIE)", slug: "baidu", category: "China", domain: "baidu.com", desc: "Baidu's ERNIE family of knowledge-enhanced LLMs powering search, chat, and enterprise AI in China." },
  { name: "Baseten", slug: "baseten", category: "Infra", domain: "baseten.co", desc: "Serverless GPU inference platform for deploying and scaling open-source ML models with $30 free credits." },
  { name: "BazaarLink", slug: "bazaarlink", category: "Router", domain: "bazaarlink.ai", desc: "Free-tier AI router with zero-cost inference for open-source models through the auto:free routing strategy." },
  { name: "Black Forest Labs", slug: "black-forest-labs", category: "Image", domain: "blackforestlabs.ai", desc: "Creators of the FLUX family of state-of-the-art text-to-image generation models." },
  { name: "Blackbox AI", slug: "blackbox", category: "LLM", domain: "blackbox.ai", desc: "AI-powered coding assistant with free unlimited basic chat, code generation, and multi-model access." },
  { name: "BytePlus ModelArk", slug: "byteplus", category: "China", domain: "byteplus.com", desc: "ByteDance's AI model platform offering access to Doubao and other models for chat and generation." },
  { name: "Cerebras", slug: "cerebras", category: "Free", domain: "cerebras.ai", desc: "Wafer-scale AI inference provider offering 1M free tokens/day at blazing speeds via custom CS-3 hardware." },
  { name: "Chutes.ai", slug: "chutes", category: "Infra", domain: "chutes.ai", desc: "OpenAI-compatible gateway providing access to a curated selection of open-source and commercial models." },
  { name: "Clarifai", slug: "clarifai", category: "Image", domain: "clarifai.com", desc: "Full-stack AI platform for computer vision, NLP, and audio with OpenAI-compatible API access." },
  { name: "Cloudflare Workers AI", slug: "cloudflare-ai", category: "Edge", domain: "cloudflare.com", desc: "Serverless GPU inference at the edge, running models on Cloudflare's global network with no cold starts." },
  { name: "Cohere", slug: "cohere", category: "LLM", domain: "cohere.com", desc: "Enterprise AI platform specializing in RAG, embeddings, and multilingual generation with 1,000 free calls/month." },
  { name: "Databricks", slug: "databricks", category: "Enterprise", domain: "databricks.com", desc: "Unified data and AI platform with Mosaic AI for building, deploying, and managing LLMs at scale." },
  { name: "DeepInfra", slug: "deepinfra", category: "Infra", domain: "deepinfra.com", desc: "Serverless inference platform for open-source models with competitive pricing and free signup credits." },
  { name: "DeepSeek", slug: "deepseek", category: "LLM", domain: "deepseek.com", desc: "Frontier Chinese AI lab known for highly efficient open-weight models with strong reasoning and coding." },
  { name: "DGrid", slug: "dgrid", category: "Infra", domain: "dgrid.ai", desc: "Decentralized GPU inference network providing OpenAI-compatible access to distributed compute resources." },
  { name: "Dify", slug: "dify", category: "Platform", domain: "dify.ai", desc: "Open-source LLM app development platform with visual workflow builder, RAG pipeline, and agent capabilities." },
  { name: "DigitalOcean", slug: "digitalocean", category: "Cloud", domain: "digitalocean.com", desc: "Cloud infrastructure provider offering AI model access alongside compute, storage, and networking services." },
  { name: "Doubao", slug: "doubao", category: "China", domain: "volcengine.com", desc: "ByteDance's conversational AI assistant and model platform, accessible via Volcengine's Ark API." },
  { name: "Empower", slug: "empower", category: "Infra", domain: "empower.dev", desc: "OpenAI-compatible inference platform with tool-calling support, optimized for function-calling workloads." },
  { name: "Fal.ai", slug: "fal-ai", category: "Image", domain: "fal.ai", desc: "Lightning-fast generative media platform for image, video, and audio models with real-time inference." },
  { name: "Featherless AI", slug: "featherless-ai", category: "Free", domain: "featherless.ai", desc: "Free-tier AI inference provider with no credit card required, focused on accessible model access." },
  { name: "Firecrawl", slug: "firecrawl", category: "Tool", domain: "firecrawl.dev", desc: "Web scraping and crawling API that turns websites into clean, LLM-ready markdown for RAG pipelines." },
  { name: "Fireworks AI", slug: "fireworks", category: "Infra", domain: "fireworks.ai", desc: "High-performance inference platform optimized for open-source models with industry-leading speed and $1 starter credits." },
  { name: "FriendliAI", slug: "friendliai", category: "Infra", domain: "friendli.ai", desc: "Serverless AI inference platform with free tier, specializing in high-throughput LLM serving and per-token pricing." },
  { name: "Google Gemini", slug: "gemini", category: "LLM", domain: "gemini.google.com", desc: "Google's multimodal AI models - natively understand text, images, audio, video, and code with free tier access." },
  { name: "GitHub Models", slug: "github-models", category: "Platform", domain: "github.com", desc: "GitHub's AI model playground with free access to top models through a personal access token." },
  { name: "Groq", slug: "groq", category: "Free", domain: "groq.com", desc: "Lightning-fast inference powered by custom LPU hardware, offering free tier with 30 RPM for multiple models." },
  { name: "HuggingFace", slug: "huggingface", category: "Platform", domain: "huggingface.co", desc: "The world's largest open-source AI community with free inference API for thousands of community-hosted models." },
  { name: "Hyperbolic", slug: "hyperbolic", category: "Infra", domain: "hyperbolic.xyz", desc: "Decentralized GPU marketplace for AI inference and compute, with trial credits for new users." },
  { name: "IBM watsonx", slug: "watsonx", category: "Enterprise", domain: "ibm.com", desc: "IBM's enterprise AI platform with foundation models, governance tools, and OpenAI-compatible gateway." },
  { name: "Ideogram", slug: "ideogram", category: "Image", domain: "ideogram.ai", desc: "Advanced text-to-image generation platform known for accurate text rendering within generated images." },
  { name: "Jina AI", slug: "jina-ai", category: "Embedding", domain: "jina.ai", desc: "Multimodal AI company providing embeddings, reranking, and reader APIs for search and RAG applications." },
  { name: "Kimi (Moonshot)", slug: "kimi", category: "China", domain: "moonshot.ai", desc: "Moonshot AI's conversational assistant known for ultra-long context windows and strong Chinese language support." },
  { name: "Lambda AI", slug: "lambda-ai", category: "Cloud", domain: "lambdalabs.com", desc: "GPU cloud provider for AI training and inference, offering on-demand access to high-end NVIDIA GPUs." },
  { name: "Leonardo AI", slug: "leonardo", category: "Image", domain: "leonardo.ai", desc: "Creative AI platform for game assets and visual content generation with fine-tuned image models." },
  { name: "Liquid AI", slug: "liquid", category: "LLM", domain: "liquid.ai", desc: "MIT spin-off building next-generation foundation models with novel adaptive neural network architectures." },
  { name: "Meta Llama", slug: "meta-llama", category: "LLM", domain: "meta.ai", desc: "Meta's open-weight LLM family - Llama 4 is the latest generation with strong multilingual and reasoning performance." },
  { name: "Minimax", slug: "minimax", category: "China", domain: "minimax.io", desc: "Chinese AI company offering multimodal models for text, voice, and video generation with competitive pricing." },
  { name: "Mistral AI", slug: "mistral", category: "LLM", domain: "mistral.ai", desc: "French AI lab producing efficient open-weight and commercial models with strong multilingual capabilities." },
  { name: "Modal", slug: "modal", category: "Infra", domain: "modal.com", desc: "High-performance serverless cloud for AI workloads with Python-native SDK and per-second billing." },
  { name: "MonsterAPI", slug: "monsterapi", category: "Infra", domain: "monsterapi.ai", desc: "GPU infrastructure platform providing access to fine-tuned open-source models without managing servers." },
  { name: "Moonshot AI", slug: "moonshot", category: "China", domain: "moonshot.ai", desc: "Beijing-based AI company developing long-context LLMs capable of processing entire novels in a single prompt." },
  { name: "NanoGPT", slug: "nanogpt", category: "Router", domain: "nanogpt.com", desc: "Pay-per-use AI gateway offering access to multiple models with simple top-up billing and no subscriptions." },
  { name: "Nebius AI", slug: "nebius", category: "Cloud", domain: "nebius.ai", desc: "European AI cloud provider offering GPU clusters and managed inference with trial credits for new users." },
  { name: "NLP Cloud", slug: "nlpcloud", category: "LLM", domain: "nlpcloud.com", desc: "Production-ready NLP API serving open-source models for text generation, classification, and entity extraction." },
  { name: "Nomic", slug: "nomic", category: "Embedding", domain: "nomic.ai", desc: "AI company building explainable embeddings and Atlas, a tool for visualizing and exploring large datasets." },
  { name: "Nous Research", slug: "nous-research", category: "LLM", domain: "nousresearch.com", desc: "Open research group producing fine-tuned, uncensored LLM variants with large community model catalog." },
  { name: "Novita AI", slug: "novita", category: "Infra", domain: "novita.ai", desc: "GPU cloud and model API platform with trial credits, supporting image generation and LLM inference." },
  { name: "NVIDIA NIM", slug: "nvidia", category: "Free", domain: "nvidia.com", desc: "NVIDIA's optimized inference microservices providing free dev access to 70+ models at production speed." },
  { name: "OCI Generative AI", slug: "oci", category: "Cloud", domain: "oracle.com", desc: "Oracle Cloud's generative AI service with OpenAI-compatible endpoints for chat and embedding models." },
  { name: "Ollama", slug: "ollama", category: "Local", domain: "ollama.com", desc: "Popular open-source tool for running LLMs locally on your own hardware with simple CLI and API." },
  { name: "OpenAI", slug: "openai", category: "LLM", domain: "openai.com", desc: "Industry leader in AI research, creators of GPT-4o, o3, and the most widely adopted AI API platform." },
  { name: "OpenRouter", slug: "openrouter", category: "Router", domain: "openrouter.ai", desc: "Leading multi-provider LLM aggregator with free models at $0/token, 290+ models, and unified billing." },
  { name: "Perplexity", slug: "perplexity", category: "LLM", domain: "perplexity.ai", desc: "AI-powered search engine combining LLMs with real-time web data for cited, accurate answers." },
  { name: "PiAPI", slug: "piapi", category: "Router", domain: "piapi.ai", desc: "Multi-model API aggregator providing access to image generation, video, and LLM models through a single key." },
  { name: "Poe", slug: "poe", category: "Platform", domain: "poe.com", desc: "Quora's AI chat platform aggregating dozens of models with a unified interface and developer API." },
  { name: "Pollinations AI", slug: "pollinations", category: "Free", domain: "pollinations.ai", desc: "Free keyless AI inference for image and text generation, with no registration required for basic access." },
  { name: "Puter AI", slug: "puter", category: "Free", domain: "puter.com", desc: "Open-source personal cloud platform with built-in AI capabilities accessible through simple auth tokens." },
  { name: "Recraft", slug: "recraft", category: "Image", domain: "recraft.ai", desc: "Professional AI design tool for creating vector illustrations, icons, and brand-consistent graphics." },
  { name: "Reka", slug: "reka", category: "LLM", domain: "reka.ai", desc: "Multimodal AI startup building frontier models with strong vision, video, and multilingual understanding." },
  { name: "Requesty", slug: "requesty", category: "Router", domain: "requesty.ai", desc: "AI model router with OpenAI-compatible API, live model catalog, and intelligent request routing." },
  { name: "Runway", slug: "runwayml", category: "Video", domain: "runwayml.com", desc: "Creative AI platform for video generation and editing, known for Gen-2 and Gen-3 Alpha text-to-video models." },
  { name: "SambaNova", slug: "sambanova", category: "Free", domain: "sambanova.ai", desc: "Enterprise AI platform with custom chips delivering high-speed inference. $5 free credits, no card needed." },
  { name: "SAP AI Hub", slug: "sap", category: "Enterprise", domain: "sap.com", desc: "SAP's generative AI platform offering foundation models integrated with enterprise business applications." },
  { name: "Scaleway AI", slug: "scaleway", category: "Cloud", domain: "scaleway.com", desc: "European cloud provider with 1M free tokens, GDPR-compliant AI inference in Paris data centers." },
  { name: "SiliconFlow", slug: "siliconflow", category: "China", domain: "siliconflow.cn", desc: "Chinese inference platform with $1 free credits and permanently free models after identity verification." },
  { name: "Snowflake Cortex", slug: "snowflake", category: "Enterprise", domain: "snowflake.com", desc: "Snowflake's managed AI service for running LLMs directly on enterprise data with SQL-based access." },
  { name: "Stability AI", slug: "stability-ai", category: "Image", domain: "stability.ai", desc: "Creators of Stable Diffusion, the leading open-source image generation model family." },
  { name: "StepFun", slug: "stepfun", category: "China", domain: "stepfun.com", desc: "Chinese AI company developing multimodal foundation models for chat, image, and video generation." },
  { name: "Tencent Hunyuan", slug: "tencent", category: "China", domain: "tencent.com", desc: "Tencent's enterprise AI model with strong Chinese language capabilities and cloud integration." },
  { name: "TheB.AI", slug: "thebai", category: "Router", domain: "theb.ai", desc: "OpenAI-compatible AI gateway providing access to a wide range of models through a single Bearer token." },
  { name: "Together AI", slug: "together", category: "Infra", domain: "together.ai", desc: "Leading open-source AI platform for training, fine-tuning, and inference with transparent pricing." },
  { name: "Upstage", slug: "upstage", category: "LLM", domain: "upstage.ai", desc: "South Korean AI company specializing in document AI, information extraction, and enterprise LLM solutions." },
  { name: "Venice.ai", slug: "venice", category: "LLM", domain: "venice.ai", desc: "Privacy-focused AI platform offering uncensored model access with no logging of user conversations." },
  { name: "Vercel AI Gateway", slug: "vercel-ai-gateway", category: "Platform", domain: "vercel.com", desc: "Vercel's managed AI gateway for routing, caching, and monitoring LLM calls in production applications." },
  { name: "Vertex AI", slug: "vertex", category: "Cloud", domain: "cloud.google.com", desc: "Google Cloud's unified ML platform for training, deploying, and consuming generative AI models at scale." },
  { name: "Voyage AI", slug: "voyage-ai", category: "Embedding", domain: "voyageai.com", desc: "Specialized embedding and reranking provider delivering state-of-the-art retrieval performance for RAG systems." },
  { name: "Weights & Biases", slug: "wandb", category: "Enterprise", domain: "wandb.ai", desc: "MLOps platform for experiment tracking, model monitoring, and LLM evaluation in production environments." },
  { name: "xAI (Grok)", slug: "xai", category: "LLM", domain: "x.ai", desc: "Elon Musk's AI company building Grok - a conversational LLM with real-time knowledge and distinctive personality." },
  { name: "Yi (01.AI)", slug: "yi", category: "China", domain: "01.ai", desc: "Chinese AI lab founded by Kai-Fu Lee, producing efficient bilingual (Chinese/English) foundation models." },
  { name: "Z.AI (GLM)", slug: "zai", category: "China", domain: "z.ai", desc: "Developer of the GLM series of bilingual chat models, known for strong performance and open-weight releases." },
];

const categories = [...new Set(providers.map((p) => p.category))];
const faviconUrl = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

export default function ProvidersPage() {
  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen bg-[#F9F9F6]">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <h1 className="text-[clamp(32px,5vw,48px)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
            <em className="italic" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>{providers.length}+</em> Providers
          </h1>
          <p className="mt-4 text-lg text-[#3A3A37]">Every AI model through one unified API. Most comprehensive catalog of any cloud AI gateway.</p>

          <div className="mt-12 space-y-14">
            {categories.sort().map((cat) => {
              const catProviders = providers.filter((p) => p.category === cat);
              return (
                <div key={cat}>
                  <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-[#7A7870]">{cat}</h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {catProviders.map((p) => (
                      <div key={p.slug} className="flex items-start gap-3 rounded-xl border border-[rgba(15,15,14,0.08)] bg-white p-4 transition-colors hover:border-[rgba(15,15,14,0.15)]">
                        <Image src={faviconUrl(p.domain)} alt={p.name} width={20} height={20} className="mt-0.5 h-5 w-5 shrink-0 rounded object-contain" unoptimized />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#0F0F0E]">{p.name}</p>
                          <p className="mt-0.5 text-xs leading-relaxed text-[#7A7870]">{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
