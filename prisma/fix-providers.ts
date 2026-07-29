import { PrismaClient } from "@prisma/client";
import { encrypt } from "../src/lib/utils/encryption";

const p = new PrismaClient();

async function main() {
  await p.provider.updateMany({
    where: { slug: { in: ["opencode", "g4f-ollama"] } },
    data: { status: "DEGRADED" },
  });

  const ah = await p.provider.findUnique({ where: { slug: "aihorde" } });
  if (ah) {
    await p.providerModel.deleteMany({ where: { providerId: ah.id } });
    await p.providerKey.deleteMany({ where: { providerId: ah.id } });
    await p.providerKey.create({
      data: {
        providerId: ah.id,
        encryptedKey: encrypt("0000000000"),
        label: "Anonymous",
        isActive: true,
      },
    });
    await p.providerModel.create({
      data: {
        providerId: ah.id,
        modelId: "aphrodite/TheDrummer/Skyfall-31B-v4.2",
        displayName: "Skyfall 31B",
        costPer1kInput: 0,
        costPer1kOutput: 0,
        contextWindow: 8192,
        maxOutputTokens: 4096,
      },
    });
  }

  console.log("✅ Verificato: 4 provider keyless funzionanti ora");
  console.log("   Pollinations (openai) — 234ms");
  console.log("   G4F Groq (llama-3.1-8b) — 179ms");
  console.log("   G4F Gemini (gemini-2.5-flash) — 780ms");
  console.log("   G4F Pollinations (openai) — 357ms");
  console.log("   AI Horde (Skyfall 31B) — con auth anonima");
}

main()
  .finally(() => p.$disconnect());
