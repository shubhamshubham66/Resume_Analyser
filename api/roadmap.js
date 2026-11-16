/**
 * Vercel Serverless Function: POST /api/roadmap
 * Builds a year-wise + domain-wise B.Tech career roadmap for Indian students.
 */

import { askJSON, rateLimited, clean } from "./_ai.js";

export const config = { maxDuration: 60 };

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduated"];
const GOALS = [
  "Placement (Software)",
  "Placement (Core / Electronics)",
  "GATE / PSU",
  "Higher Studies (MS / MTech)",
  "Government Job",
  "Startup / Freelancing",
  "Still exploring",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (rateLimited(req, { limit: 10 })) {
    return res.status(429).json({ error: "Too many requests. Please try again in an hour." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};

  const year = YEARS.includes(body.year) ? body.year : "";
  const goal = GOALS.includes(body.goal) ? body.goal : "";
  const branch = clean(body.branch, 80);
  const interest = clean(body.interest, 120);
  const skills = clean(body.skills, 400);
  const cgpa = clean(body.cgpa, 10);

  if (!year || !branch || !goal) {
    return res.status(400).json({ error: "Please select your year, branch and goal." });
  }

  const prompt = `Build a practical career roadmap for an Indian B.Tech student.

Student:
- Current year: ${year}
- Branch: ${branch}
- Main goal: ${goal}
- Interest area: ${interest || "not specified"}
- Skills so far: ${skills || "beginner, nothing significant yet"}
- CGPA: ${cgpa || "not shared"}

Rules:
- Indian context only: on-campus and off-campus placements, summer internships, PPO conversion, GATE, PSU, NIT/IIT academic calendar.
- Be specific. Name real tools, real platforms (LeetCode, GeeksforGeeks, Codeforces, Kaggle, GitHub, Unstop, Internshala) and real exam or hiring timelines by month.
- Advice must fit the student's CURRENT year. Do not tell a 3rd year student to "start in 1st year"; tell them how to catch up.
- No generic filler like "work hard" or "stay consistent".
- Keep every string short: one or two lines.

Return ONLY this JSON:
{
  "headline": "<one punchy line about where this student stands>",
  "reality_check": "<2-3 sentences, honest, on what matters most from today given their year and goal>",
  "years": [
    {
      "year": "<e.g. 3rd Year>",
      "is_current": <true|false>,
      "theme": "<what this year is for, 4-8 words>",
      "focus": ["<3-5 concrete actions>"],
      "skills": ["<3-6 skills or tools to learn this year>"],
      "projects": ["<1-3 project ideas fitting their branch and interest>"],
      "milestone": "<what should be true by the end of this year>"
    }
  ],
  "domain_plan": {
    "domain": "<the domain they should commit to>",
    "why": "<1-2 lines matching their branch, interest and goal>",
    "learning_order": ["<ordered steps, 4-7 items, each with a rough duration>"],
    "tools": ["<4-8 tools or technologies>"],
    "proof_of_work": ["<2-4 things that prove this skill to a recruiter>"]
  },
  "next_90_days": [
    { "month": "Month 1", "focus": "<short>", "tasks": ["<2-4 specific tasks>"] },
    { "month": "Month 2", "focus": "<short>", "tasks": ["<2-4 specific tasks>"] },
    { "month": "Month 3", "focus": "<short>", "tasks": ["<2-4 specific tasks>"] }
  ],
  "key_timelines": [
    { "when": "<month or window>", "what": "<exam, application or hiring season this student must not miss>" }
  ],
  "mistakes_to_avoid": ["<3-5 mistakes students with this profile actually make>"]
}

In "years", include every year from ${year} to 4th Year. If the student is Graduated, give one entry for the next 12 months instead. Mark is_current true only for ${year}.`;

  const out = await askJSON({
    system:
      "You are a senior career mentor for Indian engineering students. You have seen thousands of NIT and IIT placement cycles and you give blunt, specific, actionable advice.",
    prompt,
    maxTokens: 4000,
  });

  if (!out.ok) {
    return res.status(out.status).json({ error: out.error });
  }

  const d = out.data || {};
  const arr = (v, n) => (Array.isArray(v) ? v.slice(0, n) : []);

  return res.status(200).json({
    headline: typeof d.headline === "string" ? d.headline : "",
    reality_check: typeof d.reality_check === "string" ? d.reality_check : "",
    years: arr(d.years, 5),
    domain_plan: d.domain_plan && typeof d.domain_plan === "object" ? d.domain_plan : null,
    next_90_days: arr(d.next_90_days, 3),
    key_timelines: arr(d.key_timelines, 8),
    mistakes_to_avoid: arr(d.mistakes_to_avoid, 6),
    meta: { year, branch, goal, interest },
  });
}
