/**
 * Shared AI helper for the serverless functions.
 * Gemini is tried first (free tier), Groq is the fallback.
 * Keys come from GEMINI_API_KEY / GROQ_API_KEY.
 *
 * Not a route: Vercel ignores files in /api that start with "_".
 */

const GEMINI_DEFAULT = "gemini-2.5-flash,gemini-2.5-flash-lite";
const GROQ_DEFAULT = "openai/gpt-oss-20b,llama-3.3-70b-versatile,openai/gpt-oss-120b";

function list(value, fallback) {
  return (value || fallback).split(",").map((m) => m.trim()).filter(Boolean);
}

async function callGemini({ apiKey, system, prompt, maxTokens }) {
  for (const model of list(process.env.GEMINI_MODELS, GEMINI_DEFAULT)) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: maxTokens,
              responseMimeType: "application/json",
            },
          }),
        }
      );
      if (!r.ok) continue;
      const d = await r.json();
      const text = d.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
      if (text) return text;
    } catch {
      /* try the next model */
    }
  }
  return "";
}

async function callGroq({ apiKey, system, prompt, maxTokens }) {
  let models = list(process.env.GROQ_MODELS, GROQ_DEFAULT);

  // Only try models this account can actually use (avoids model_not_found).
  try {
    const mr = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (mr.ok) {
      const ids = new Set(((await mr.json()).data || []).map((m) => m.id));
      const usable = models.filter((m) => ids.has(m));
      if (usable.length) models = usable;
    }
  } catch {
    /* keep the static list */
  }

  for (const model of models) {
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
          max_tokens: maxTokens,
        }),
      });
      if (!r.ok) continue;
      const d = await r.json();
      const text = d.choices?.[0]?.message?.content || "";
      if (text) return text;
    } catch {
      /* try the next model */
    }
  }
  return "";
}

/**
 * Ask the AI for JSON. Returns { ok, data, error, status }.
 */
export async function askJSON({ system, prompt, maxTokens = 4000 }) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (!geminiKey && !groqKey) {
    return {
      ok: false,
      status: 500,
      error: "No AI key configured (set GEMINI_API_KEY and/or GROQ_API_KEY).",
    };
  }

  const fullSystem = `${system} Return ONLY valid JSON. No markdown, no code fences, no commentary.`;

  let text = "";
  if (geminiKey) text = await callGemini({ apiKey: geminiKey, system: fullSystem, prompt, maxTokens });
  if (!text && groqKey) text = await callGroq({ apiKey: groqKey, system: fullSystem, prompt, maxTokens });

  if (!text) {
    return {
      ok: false,
      status: 429,
      error: "Our AI is busy right now (usage limit reached). Please try again in a minute.",
    };
  }

  try {
    let c = text.trim();
    if (c.startsWith("```json")) c = c.slice(7);
    else if (c.startsWith("```")) c = c.slice(3);
    if (c.endsWith("```")) c = c.slice(0, -3);
    return { ok: true, data: JSON.parse(c.trim()) };
  } catch {
    return { ok: false, status: 502, error: "AI returned an unreadable response. Please try again." };
  }
}

/**
 * Best-effort per-IP throttle. Serverless instances do not share memory, so
 * this only slows down repeat traffic that lands on the same instance.
 * Swap for Vercel KV / Upstash when real limits are needed.
 */
const hits = new Map();

export function rateLimited(req, { limit = 8, windowMs = 60 * 60 * 1000 } = {}) {
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + windowMs });
    if (hits.size > 5000) hits.clear();
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

/** Trim and cap a user-supplied string. */
export function clean(value, max = 200) {
  return String(value ?? "").trim().slice(0, max);
}
