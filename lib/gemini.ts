// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
export const runtime = "nodejs";

export function getGemini(model: string = "gemini-2.5-pro") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY env var");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model });
}
