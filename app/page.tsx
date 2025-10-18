// app/page.tsx
"use client";
import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const content = input.trim();
    if (!content) return;
    setInput("");

    // enforce literal types for role
    const next: Msg[] = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          system: "You are a helpful assistant.",
        }),
      });
      const data = await res.json();

      if (data.ok) {
        setMessages([...next, { role: "assistant" as const, content: data.text }]);
      } else {
        setMessages([...next, { role: "assistant" as const, content: `Error: ${data.error}` }]);
      }
    } catch (e: any) {
      setMessages([...next, { role: "assistant" as const, content: `Network error: ${e?.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  // ✅ الـ return لازم يفضل داخل الدالة
  return (
    <main className="min-h-dvh flex flex-col items-center p-6 gap-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold">Next.js + Gemini Chat</h1>
        <p className="text-sm opacity-70">
          Your API key stays on the server. Safe to share the site link.
        </p>
      </div>

      <div className="w-full max-w-2xl border rounded-2xl p-4 space-y-3">
        <div className="h-[420px] overflow-y-auto space-y-3">
          {messages.length === 0 && (
            <div className="text-sm opacity-70">Start the conversation…</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <div
                className={`inline-block px-3 py-2 rounded-xl text-sm ${
                  m.role === "user" ? "bg-gray-200" : "bg-gray-100"
                }`}
              >
                <b className="opacity-70 mr-1">{m.role === "user" ? "You" : "AI"}:</b>
                <span>{m.content}</span>
              </div>
            </div>
          ))}
          {loading && <div className="text-sm opacity-70">Thinking…</div>}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-xl px-3 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything…"
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            className="px-4 py-2 rounded-xl border disabled:opacity-50"
            onClick={send}
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
