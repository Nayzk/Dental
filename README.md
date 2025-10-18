# Next.js + Gemini (Vercel)

## Local
1. Node 18+ recommended.
2. Create `.env.local` and put `GEMINI_API_KEY=...`.
3. `npm i`
4. `npm run dev` → http://localhost:3000

## Deploy on Vercel
1. Push this repo to GitHub (or import directly in Vercel).
2. In Vercel → New Project → import the repo.
3. Add env var: `GEMINI_API_KEY` (Production + Preview + Development).
4. Deploy. You’ll get a public HTTPS URL to share.

## Notes
- The API route is `/api/chat` and calls Gemini server‑side.
- Change model via request body `model` or change default in `lib/gemini.ts`.
- Keep secrets server-side; don’t call Gemini directly from the browser.