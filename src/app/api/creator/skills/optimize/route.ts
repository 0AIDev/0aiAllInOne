import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-options";

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { title?: string; description?: string; content?: string; triggers?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, description, content, triggers } = body;

  if (!content || typeof content !== "string") {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  let optimized = content.trim();

  if (title) {
    const titleHeader = `# ${title}\n\n`;
    if (!optimized.startsWith("# ")) {
      optimized = titleHeader + optimized;
    }
  }

  if (description) {
    const descBlock = `> ${description}\n\n`;
    if (!optimized.includes(description)) {
      const firstHeader = optimized.indexOf("\n\n");
      if (firstHeader !== -1) {
        optimized =
          optimized.slice(0, firstHeader + 2) + descBlock + optimized.slice(firstHeader + 2);
      } else {
        optimized = descBlock + optimized;
      }
    }
  }

  if (triggers) {
    const triggerList = triggers
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (triggerList.length > 0 && !optimized.includes("## Triggers")) {
      optimized += `\n\n## Triggers\n\n${triggerList.map((t) => `- \`${t}\``).join("\n")}`;
    }
  }

  optimized =
    optimized
      .replace(/\n{4,}/g, "\n\n\n")
      .trim() +
    "\n\n---\n*This is a simple optimization. Full AI optimization coming soon.*";

  return NextResponse.json({ optimizedContent: optimized });
}
