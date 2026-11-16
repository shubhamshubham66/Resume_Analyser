import { useState } from "react";

export function meta() {
  return [
    { title: "B.Tech Career Roadmap Generator - ResumeAI" },
    {
      name: "description",
      content:
        "Get a year-wise and domain-wise career roadmap built for Indian B.Tech students — placements, internships, GATE and projects.",
    },
  ];
}

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

const BRANCHES = [
  "Computer Science",
  "Electronics & Communication",
  "Electronics & Instrumentation",
  "Electrical",
  "Mechanical",
  "Civil",
  "Chemical",
  "Production / Industrial",
  "Other",
];

interface YearPlan {
  year?: string;
  is_current?: boolean;
  theme?: string;
  focus?: string[];
  skills?: string[];
  projects?: string[];
  milestone?: string;
}

interface DomainPlan {
  domain?: string;
  why?: string;
  learning_order?: string[];
  tools?: string[];
  proof_of_work?: string[];
}

interface Roadmap {
  headline?: string;
  reality_check?: string;
  years?: YearPlan[];
  domain_plan?: DomainPlan | null;
  next_90_days?: { month?: string; focus?: string; tasks?: string[] }[];
  key_timelines?: { when?: string; what?: string }[];
  mistakes_to_avoid?: string[];
}

function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-7 ${className}`}>
      {title && <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>}
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
      {children}
    </span>
  );
}

function Bullets({ items, color = "blue" }: { items?: string[]; color?: "blue" | "red" }) {
  if (!items?.length) return null;
  const dot = color === "red" ? "bg-red-400" : "bg-blue-500";
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2.5 text-sm text-gray-700 leading-relaxed">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default function RoadmapPage() {
  const [form, setForm] = useState({
    year: "",
    branch: "",
    goal: "",
    interest: "",
    skills: "",
    cgpa: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Roadmap | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const ready = form.year && form.branch && form.goal;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setStatus("loading");
    setError(null);
    setData(null);
    try {
      const r = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await r.json().catch(() => null);
      if (!r.ok) throw new Error(json?.error || `Request failed (HTTP ${r.status})`);
      setData(json);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Built for Indian B.Tech students
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Your Career Roadmap</h1>
          <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg">
            Tell us where you are. Get a year-wise and domain-wise plan with real timelines for
            placements, internships and GATE.
          </p>
        </div>

        {/* Form */}
        <Card className="mb-8">
          <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Current year <span className="text-red-500">*</span>
              </label>
              <select value={form.year} onChange={set("year")} className={inputCls} required>
                <option value="">Select year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Branch <span className="text-red-500">*</span>
              </label>
              <select value={form.branch} onChange={set("branch")} className={inputCls} required>
                <option value="">Select branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Main goal <span className="text-red-500">*</span>
              </label>
              <select value={form.goal} onChange={set("goal")} className={inputCls} required>
                <option value="">Select goal</option>
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Interest area <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                value={form.interest}
                onChange={set("interest")}
                placeholder="e.g. AI/ML, embedded, web dev"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                CGPA <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input value={form.cgpa} onChange={set("cgpa")} placeholder="e.g. 8.2" className={inputCls} />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Skills you already have <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                value={form.skills}
                onChange={set("skills")}
                placeholder="e.g. C++, basic DSA, Arduino, one React project"
                className={inputCls}
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={!ready || status === "loading"}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {status === "loading" ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Building your roadmap…
                  </>
                ) : (
                  <>Generate my roadmap</>
                )}
              </button>
            </div>
          </form>
        </Card>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 mb-8">
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button onClick={submit} className="text-xs text-red-700 underline mt-1">
              Try again
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                <div className="h-4 w-1/3 bg-gray-200 rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                  <div className="h-3 bg-gray-100 rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Result */}
        {status === "done" && data && (
          <div className="space-y-6">
            {(data.headline || data.reality_check) && (
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 sm:p-8 shadow-lg shadow-blue-500/20">
                {data.headline && <h2 className="text-xl sm:text-2xl font-bold mb-3">{data.headline}</h2>}
                {data.reality_check && (
                  <p className="text-blue-50 leading-relaxed text-sm sm:text-base">{data.reality_check}</p>
                )}
              </div>
            )}

            {!!data.years?.length && (
              <Card title="Year-wise plan">
                <div className="space-y-5">
                  {data.years.map((y, i) => (
                    <div
                      key={i}
                      className={`relative rounded-xl border p-5 ${
                        y.is_current ? "border-blue-300 bg-blue-50/50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="font-bold text-gray-900">{y.year}</h3>
                        {y.is_current && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-semibold">
                            You are here
                          </span>
                        )}
                        {y.theme && <span className="text-sm text-gray-500">— {y.theme}</span>}
                      </div>

                      {!!y.focus?.length && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Focus</p>
                          <Bullets items={y.focus} />
                        </div>
                      )}

                      {!!y.skills?.length && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {y.skills.map((s, j) => (
                              <Pill key={j}>{s}</Pill>
                            ))}
                          </div>
                        </div>
                      )}

                      {!!y.projects?.length && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Projects</p>
                          <Bullets items={y.projects} />
                        </div>
                      )}

                      {y.milestone && (
                        <p className="text-sm text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2">
                          <span className="font-semibold">By year end: </span>
                          {y.milestone}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {data.domain_plan && (
              <Card title={`Domain plan — ${data.domain_plan.domain || ""}`}>
                {data.domain_plan.why && (
                  <p className="text-sm text-gray-700 mb-5 leading-relaxed">{data.domain_plan.why}</p>
                )}

                {!!data.domain_plan.learning_order?.length && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                      Learning order
                    </p>
                    <ol className="space-y-3">
                      {data.domain_plan.learning_order.map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-700">
                          <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="pt-0.5">{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {!!data.domain_plan.tools?.length && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {data.domain_plan.tools.map((t, i) => (
                        <Pill key={i}>{t}</Pill>
                      ))}
                    </div>
                  </div>
                )}

                {!!data.domain_plan.proof_of_work?.length && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                      Proof of work
                    </p>
                    <Bullets items={data.domain_plan.proof_of_work} />
                  </div>
                )}
              </Card>
            )}

            {!!data.next_90_days?.length && (
              <Card title="Next 90 days">
                <div className="grid gap-4 sm:grid-cols-3">
                  {data.next_90_days.map((m, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 p-4">
                      <p className="font-bold text-gray-900 text-sm">{m.month}</p>
                      {m.focus && <p className="text-xs text-blue-700 font-medium mb-3">{m.focus}</p>}
                      <Bullets items={m.tasks} />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {!!data.key_timelines?.length && (
              <Card title="Dates you cannot miss">
                <div className="divide-y divide-gray-100">
                  {data.key_timelines.map((t, i) => (
                    <div key={i} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                      <span className="shrink-0 w-28 text-sm font-semibold text-blue-700">{t.when}</span>
                      <span className="text-sm text-gray-700">{t.what}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {!!data.mistakes_to_avoid?.length && (
              <Card title="Mistakes to avoid">
                <Bullets items={data.mistakes_to_avoid} color="red" />
              </Card>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => {
                  setStatus("idle");
                  setData(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Start over
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition"
              >
                Save as PDF
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center pt-2">
              AI-generated guidance. Always confirm exam dates and deadlines on official websites.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
