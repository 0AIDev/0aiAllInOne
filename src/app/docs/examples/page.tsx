import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Examples - AI0FY",
  description: "Code examples for integrating AI0FY in various programming languages.",
};

const examples = [
  {
    title: "Basic Chat Completion (curl)",
    lang: "bash",
    code: `curl https://api.ai0fy.dev/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`,
  },
  {
    title: "Streaming Chat (Python)",
    lang: "python",
    code: `from ai0fy import AI0FY

client = AI0FY(api_key="YOUR_API_KEY")

stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Write a poem"}],
    stream=True,
)

for chunk in stream:
    print(chunk.choices[0].delta.content, end="")`,
  },
  {
    title: "Multi-Provider Fallback (TypeScript)",
    lang: "typescript",
    code: `import { AI0FY } from "ai0fy";

const client = new AI0FY({
  apiKey: "YOUR_API_KEY",
  fallbacks: ["anthropic/claude-3", "google/gemini-pro"],
});

const response = await client.chat.completions.create({
  model: "openai/gpt-4o",
  messages: [{ role: "user", content: "Explain quantum computing" }],
});

console.log(response.choices[0].message.content);`,
  },
  {
    title: "Prompt Compression (Python)",
    lang: "python",
    code: `from ai0fy import AI0FY

client = AI0FY(api_key="YOUR_API_KEY")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": long_prompt}],
    compression=True,
    compression_ratio=0.5,  # target 50% reduction
)

print(response.choices[0].message.content)
print(f"Tokens saved: {response.usage.compression_savings}")`,
  },
];

export default function ExamplesPage() {
  return (
    <>
      <Navbar user={null} />
      <div className="bg-[#F9F9F6]">
        <main>
          <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
            <h1
              className="text-[clamp(32px,5vw,48px)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0F0F0E]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              <em
                className="italic"
                style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
              >
                Examples
              </em>
            </h1>
            <p className="mt-4 text-lg text-[#3A3A37]">
              Ready-to-use code examples for common AI0FY integration scenarios.
            </p>

            <div className="mt-12 space-y-6">
              {examples.map((example) => (
                <div
                  key={example.title}
                  className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white overflow-hidden"
                >
                  <div className="border-b border-[rgba(15,15,14,0.06)] px-6 py-4">
                    <h2 className="text-lg font-medium text-[#0F0F0E]">{example.title}</h2>
                  </div>
                  <div className="overflow-x-auto bg-[#0F0F0E] p-6">
                    <pre className="text-sm leading-relaxed text-[#B8B5AE] font-mono whitespace-pre">
                      {example.code}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
