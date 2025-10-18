// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { getGemini } from "../../../lib/gemini";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { messages, system, model = "gemini-2.5-pro" } = await request.json();

    // جرّب بدائل تلقائية لو الموديل الافتراضي رجّع 404
    const candidates = [model, "gemini-1.5-flash-002", "gemini-1.5-flash-8b"];

    let text = "";
    let lastErr: any = null;

    for (const m of candidates) {
      try {
        const mm = getGemini(m);
        const userText = (messages ?? [])
          .map((x: { role: string; content: string }) => `${x.role.toUpperCase()}: ${x.content}`)
          .join("\n\n");

        const prompt = [system ? `SYSTEM: ${system}` : null, userText || "USER: Say hello"]
          .filter(Boolean)
          .join("\n\n");

        const result = await mm.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        text = result.response.text();
        return NextResponse.json({ ok: true, text, modelUsed: m });
      } catch (e) {
        lastErr = e;
        continue;
      }
    }

    throw new Error(lastErr?.message || "All models failed");
  } catch (err: any) {
    console.error("[/api/chat] error:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}
