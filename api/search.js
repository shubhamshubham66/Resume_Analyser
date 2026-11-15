/**
 * Vercel Serverless Function: GET /api/search?q=...&start=1
 * Google Programmable Search (Custom Search JSON API).
 * Env: GOOGLE_API_KEY, GOOGLE_CSE_ID (keys stay on the server).
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CSE_ID;
  if (!key || !cx) {
    return res.status(500).json({ error: "GOOGLE_API_KEY / GOOGLE_CSE_ID not set." });
  }

  const q = String(req.query?.q || "").trim().slice(0, 200);
  if (!q) return res.status(400).json({ error: "Missing query (q)." });
  const start = Math.min(91, Math.max(1, parseInt(req.query?.start, 10) || 1));

  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.search = new URLSearchParams({ key, cx, q, start: String(start), num: "10" }).toString();

  try {
    const r = await fetch(url);
    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: data?.error?.message || "Search API error" });
    }
    return res.status(200).json({
      total: Number(data.searchInformation?.totalResults) || 0,
      items: (data.items || []).map((i) => ({
        title: i.title,
        link: i.link,
        snippet: i.snippet,
        displayLink: i.displayLink,
      })),
    });
  } catch (e) {
    return res.status(500).json({ error: "Network error: " + (e.message || String(e)) });
  }
}
