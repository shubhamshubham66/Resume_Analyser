import { Link } from "react-router";
import { Icon, type IconName } from "~/components/Icon";

export function meta() {
  return [
    { title: "ResumeAI - Resume analysis and career roadmaps for B.Tech students" },
    {
      name: "description",
      content:
        "Free tools for Indian engineering students: an ATS resume analysis with exact rewrites, and a year-wise career roadmap for placements, internships and GATE.",
    },
  ];
}

/* ---------------------------------------------------------------- data */

const TOOLS: {
  to: string;
  name: string;
  icon: IconName;
  lead: string;
  points: string[];
  cta: string;
  live: boolean;
}[] = [
  {
    to: "/analyze-resume",
    name: "Resume analysis",
    icon: "file",
    lead: "Upload a PDF or DOCX. Get back a score and the exact lines to change.",
    points: [
      "ATS score out of 100, section by section",
      "Your weak bullet points quoted back to you",
      "Rewrites you can paste straight in",
    ],
    cta: "Analyze my resume",
    live: true,
  },
  {
    to: "/roadmap",
    name: "Career roadmap",
    icon: "route",
    lead: "Your year, branch and goal turn into a plan with real dates on it.",
    points: [
      "Year-wise plan from where you are now",
      "One domain to commit to, in learning order",
      "The next 90 days, month by month",
    ],
    cta: "Build my roadmap",
    live: true,
  },
];

const CHECKS: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "gauge",
    title: "ATS score",
    desc: "One compatibility score out of 100, scored the way parsers read your file.",
  },
  {
    icon: "code",
    title: "Hard skills",
    desc: "Which technical skills and tools are on the page, and which ones are missing.",
  },
  {
    icon: "users",
    title: "Soft skills",
    desc: "Whether communication, leadership and ownership show up as evidence, not adjectives.",
  },
  {
    icon: "search",
    title: "Searchability",
    desc: "Section headings, file format and how cleanly a parser can read your content.",
  },
  {
    icon: "layout",
    title: "Formatting",
    desc: "Layout, fonts, margins, bullet structure and length against what recruiters scan.",
  },
  {
    icon: "checklist",
    title: "Section scores",
    desc: "Experience, Education, Skills, Projects and Summary each get their own score.",
  },
  {
    icon: "pencil",
    title: "Rewrites",
    desc: "Before and after versions of your weakest lines, written out in full.",
  },
];

const STEPS = [
  {
    icon: "file" as IconName,
    title: "Give it something real",
    desc: "Your resume file, or your year, branch and goal. Takes under a minute.",
  },
  {
    icon: "bolt" as IconName,
    title: "It reads and scores",
    desc: "The AI works through every section and compares it against what recruiters look for.",
  },
  {
    icon: "chart" as IconName,
    title: "You get specifics",
    desc: "Scores, the lines that are hurting you, and what to do in the next 90 days.",
  },
];

const GETS: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "key",
    title: "Missing keywords",
    desc: "The technical and soft skills recruiters search for that your resume never mentions.",
  },
  {
    icon: "chart",
    title: "A score per section",
    desc: "Experience, Skills, Education and Projects scored separately, so you know where to spend your time.",
  },
  {
    icon: "pencil",
    title: "Exact rewrites",
    desc: "Not 'use strong verbs'. The actual replacement line, written out, ready to paste.",
  },
  {
    icon: "route",
    title: "A plan with dates",
    desc: "A year-wise roadmap that starts from your current year, not from first year.",
  },
  {
    icon: "calendar",
    title: "Seasons you cannot miss",
    desc: "When internship applications open, when GATE lands, when on-campus registration starts.",
  },
  {
    icon: "shield",
    title: "Nothing stored",
    desc: "No account, no database. Your file is read once to produce the analysis, then dropped.",
  },
];

const FAQS = [
  {
    q: "Is it actually free?",
    a: "Yes, and there is no sign-up. It runs on free AI tiers, which is also why you may occasionally see a 'busy, try again' message.",
  },
  {
    q: "Is my resume stored anywhere?",
    a: "No. The file is read once to produce the analysis and then dropped. There is no database and no account.",
  },
  {
    q: "Will an ATS score of 90 get me shortlisted?",
    a: "No. A good score means a parser can read your resume properly. What you have actually built still decides the rest.",
  },
  {
    q: "Can the advice be wrong?",
    a: "Yes. It is an AI, and it can be confidently wrong, especially about dates. Confirm every exam date and deadline on the official website.",
  },
  {
    q: "Is this only for CSE students?",
    a: "No. The roadmap asks for your branch and adjusts, including for core and electronics paths.",
  },
  {
    q: "Which file types work?",
    a: "PDF and DOCX, up to 5MB. Scanned images of a resume will not parse.",
  },
];

/* ---------------------------------------------------------------- page */

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero — continues the navbar's ink block */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:py-24">
          <div>
            <h1 className="font-serif text-[2.5rem] leading-[1.05] sm:text-[3.25rem] lg:text-[3.6rem]">
              Stop guessing what your resume is doing wrong.
            </h1>
            <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.7] text-[#AEB8CC]">
              Two free tools for engineering students in India. One reads your resume and tells you
              which lines to fix. The other turns your year, branch and goal into a plan with real
              dates on it.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/analyze-resume"
                className="rounded-[4px] bg-crimson px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-crimson-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Analyze my resume
              </Link>
              <Link
                to="/roadmap"
                className="rounded-[4px] border border-white/25 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Build my roadmap
              </Link>
            </div>

            <p className="mt-6 text-[14px] text-[#8793AC]">
              Free, no sign-up, and your file is never stored.
            </p>
          </div>

          {/* Sample result */}
          <div className="relative">
            <div className="rounded-[6px] bg-white p-5 shadow-2xl shadow-black/30">
              <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="font-serif text-[15px] font-semibold text-ink">
                  Analysis result
                </span>
                <span className="rounded-[3px] bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  Sample
                </span>
              </div>

              <div className="mb-5 flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-full border-[3px] border-emerald-400">
                  <span className="text-xl font-bold text-emerald-600">78</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">ATS score</p>
                  <p className="text-xs text-gray-500">Readable, but three sections need work</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: "Hard skills", score: 90, tone: "bg-emerald-400" },
                  { name: "Experience", score: 72, tone: "bg-blue-400" },
                  { name: "Formatting", score: 85, tone: "bg-emerald-400" },
                  { name: "Searchability", score: 58, tone: "bg-amber-400" },
                  { name: "Projects", score: 64, tone: "bg-amber-400" },
                ].map((row) => (
                  <div key={row.name} className="flex items-center gap-3">
                    <span className="w-24 text-xs font-medium text-gray-600">{row.name}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <span
                        className={`block h-1.5 rounded-full ${row.tone}`}
                        style={{ width: `${row.score}%` }}
                      />
                    </span>
                    <span className="w-8 text-right text-xs font-semibold text-gray-700">
                      {row.score}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[4px] border-l-[3px] border-crimson bg-gray-50 p-3">
                <p className="text-[11px] font-semibold text-gray-500">Weakest line found</p>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-700">
                  &ldquo;Worked on a web development project using React.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The two tools */}
      <section className="border-b border-gray-200 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-serif text-[2rem] text-ink sm:text-[2.4rem]">
            Two tools, one problem
          </h2>
          <p className="mt-3 max-w-[58ch] text-[16.5px] leading-relaxed text-gray-600">
            Knowing where you stand, and knowing what to do about it, are different questions. Each
            tool answers one of them.
          </p>

          <div className="mt-10 grid gap-px overflow-hidden rounded-[6px] border border-gray-200 bg-gray-200 lg:grid-cols-2">
            {TOOLS.map((t) => (
              <div key={t.name} className="flex flex-col bg-white p-7 sm:p-8">
                <span className="grid h-11 w-11 place-items-center rounded-[4px] bg-ink text-white">
                  <Icon name={t.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-serif text-[1.6rem] text-ink">{t.name}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-gray-600">{t.lead}</p>

                <ul className="mt-6 space-y-2.5 border-t border-gray-100 pt-6">
                  {t.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[15px] text-gray-700">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-crimson" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={t.to}
                  className="mt-7 inline-block self-start rounded-[4px] bg-crimson px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-crimson-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                >
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[6px] border border-dashed border-gray-300 px-5 py-4">
            <span className="grid h-9 w-9 place-items-center rounded-[4px] bg-gray-100 text-gray-500">
              <Icon name="chat" className="h-[18px] w-[18px]" />
            </span>
            <p className="text-[15px] text-gray-600">
              <span className="font-semibold text-ink">Interview prep</span> — role-specific
              questions, GD topics and feedback on your answers. Being built now.
            </p>
          </div>
        </div>
      </section>

      {/* What it checks */}
      <section className="border-b border-gray-200 bg-[#F7F8FA] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-serif text-[2rem] text-ink sm:text-[2.4rem]">
            What the resume analysis checks
          </h2>
          <p className="mt-3 max-w-[58ch] text-[16.5px] leading-relaxed text-gray-600">
            Seven areas, each scored on its own, so the result points at something you can fix
            rather than one number you cannot act on.
          </p>

          <div className="mt-10 grid gap-px overflow-hidden rounded-[6px] border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-4">
            {CHECKS.map((c) => (
              <div key={c.title} className="bg-white p-6">
                <span className="text-crimson">
                  <Icon name={c.icon} className="h-[22px] w-[22px]" />
                </span>
                <h3 className="mt-4 text-[15.5px] font-semibold text-ink">{c.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">{c.desc}</p>
              </div>
            ))}
            <div className="flex flex-col justify-center bg-ink p-6">
              <p className="font-serif text-[1.25rem] leading-snug text-white">
                See all seven on your own resume.
              </p>
              <Link
                to="/analyze-resume"
                className="mt-4 inline-block self-start rounded-[4px] bg-crimson px-4 py-2.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-crimson-dark"
              >
                Run the analysis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — a sequence, so it is numbered */}
      <section className="border-b border-gray-200 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-serif text-[2rem] text-ink sm:text-[2.4rem]">How it works</h2>

          <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative sm:pr-6">
                {/* rule connecting the steps */}
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 top-[21px] hidden border-t border-dashed border-gray-300 sm:block"
                  />
                )}
                <div className="relative flex items-center">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gray-300 bg-white text-gray-500">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="bg-white px-3 font-serif text-[15px] font-semibold text-crimson">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-[17px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-gray-600">
                  {s.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What you get — horizontal rail */}
      <section className="border-b border-gray-200 bg-[#F7F8FA] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-[2rem] text-ink sm:text-[2.4rem]">What you get</h2>
              <p className="mt-3 max-w-[52ch] text-[16.5px] leading-relaxed text-gray-600">
                Across both tools, this is what lands on your screen.
              </p>
            </div>
            <p className="text-[13.5px] text-gray-500">Scroll sideways for more</p>
          </div>
        </div>

        <div
          role="region"
          aria-label="What you get"
          tabIndex={0}
          className="mx-auto mt-10 flex max-w-6xl snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson sm:scroll-pl-6 sm:px-6"
        >
          {GETS.map((g) => (
            <article
              key={g.title}
              className="flex w-[280px] shrink-0 snap-start flex-col rounded-[6px] border border-gray-200 bg-white p-6 sm:w-[320px]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-[4px] border border-gray-200 text-crimson">
                <Icon name={g.icon} className="h-[20px] w-[20px]" />
              </span>
              <h3 className="mt-5 text-[16px] font-semibold text-ink">{g.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">{g.desc}</p>
            </article>
          ))}
          <span aria-hidden="true" className="w-2 shrink-0 sm:w-4" />
        </div>
      </section>

      {/* Questions */}
      <section className="border-b border-gray-200 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <h2 className="font-serif text-[2rem] text-ink sm:text-[2.4rem]">
              Questions worth asking
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-gray-600">
              Including the ones where the honest answer is no.
            </p>
          </div>

          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium text-ink marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson">
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gray-300 text-gray-500 transition-transform group-open:rotate-45"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 max-w-[62ch] text-[15.5px] leading-[1.7] text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-7 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-serif text-[2rem] leading-tight text-white sm:text-[2.4rem]">
              Start with whichever is bothering you more.
            </h2>
            <p className="mt-3 max-w-[52ch] text-[16px] leading-relaxed text-[#AEB8CC]">
              The resume if you are applying this month. The roadmap if you are not sure what you
              are applying for yet.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              to="/analyze-resume"
              className="rounded-[4px] bg-crimson px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-crimson-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Analyze my resume
            </Link>
            <Link
              to="/roadmap"
              className="rounded-[4px] border border-white/25 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Build my roadmap
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
