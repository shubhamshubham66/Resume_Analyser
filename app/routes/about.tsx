import { Link } from "react-router";
import { SITE } from "~/site";

export function meta() {
  return [
    { title: "About - ResumeAI" },
    {
      name: "description",
      content:
        "Why ResumeAI exists: honest resume feedback and career roadmaps built for Indian engineering students.",
    },
  ];
}

const TOOLS = [
  {
    to: "/analyze-resume",
    name: "Resume analysis",
    body: "Upload a PDF or DOCX and get an ATS score, the weak lines quoted back to you, and rewrites you can paste in.",
    status: "Live",
  },
  {
    to: "/roadmap",
    name: "Career roadmap",
    body: "Your year, branch and goal turn into a year-wise plan, a domain to commit to, and the next 90 days.",
    status: "Live",
  },
  {
    to: "/contact",
    name: "Interview prep",
    body: "Role-specific questions, GD topics, and feedback on the answers you write. Being built now.",
    status: "Coming",
  },
];

export default function About() {
  return (
    <div className="bg-white">
      {/* Opening statement */}
      <section className="border-b border-gray-200">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:items-end lg:gap-20">
          <h1 className="font-serif text-4xl leading-[1.05] text-ink sm:text-[3.25rem] lg:text-[3.75rem]">
            Most placement advice is written for someone else.
          </h1>
          <div>
            <div className="space-y-5 text-[17px] leading-[1.75] text-gray-700">
              <p>
                A third-year student from a tier-2 branch does not need the same plan as a CSE
                student with three internships. But the advice on the internet is the same for
                everyone: grind DSA, build projects, stay consistent. It skips the part you
                actually need — what to do this month, given where you already are.
              </p>
              <p>
                ResumeAI is an attempt to fix that one gap. You give it your real situation, it
                gives you specifics. No course to buy, no call to book, no waitlist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is here */}
      <section className="border-b border-gray-200 bg-[#F7F8FA]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="font-serif text-[2rem] text-ink">What you can use today</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-gray-200 bg-gray-200 sm:grid-cols-3">
            {TOOLS.map((t) => (
              <Link
                key={t.name}
                to={t.to}
                className="group bg-white p-6 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-crimson"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-xl text-ink group-hover:text-crimson">{t.name}</h3>
                  <span
                    className={`shrink-0 rounded-[3px] px-1.5 py-0.5 text-[11px] font-semibold ${
                      t.status === "Live"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{t.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who made it + how it works */}
      <section className="border-b border-gray-200">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-serif text-[2rem] text-ink">Who builds this</h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.75] text-gray-700">
              <p>
                One engineering student, still in the middle of the same placement cycle this site
                is about. That is the whole team.
              </p>
              <p>
                It means things ship slowly and sometimes break. It also means the advice comes
                from inside the problem rather than from a content calendar. If something here is
                wrong or unhelpful,{" "}
                <Link to="/contact" className="font-medium text-crimson underline underline-offset-4">
                  tell me
                </Link>{" "}
                and it gets fixed.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-[2rem] text-ink">How your data is handled</h2>
            <dl className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
              <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="text-[15px] font-medium text-ink">Your resume</dt>
                <dd className="text-[15px] leading-relaxed text-gray-600">
                  Read once to produce the analysis, then dropped. Nothing is saved to a database.
                </dd>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="text-[15px] font-medium text-ink">Accounts</dt>
                <dd className="text-[15px] leading-relaxed text-gray-600">
                  There are none. You do not sign up to use anything here.
                </dd>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="text-[15px] font-medium text-ink">The AI</dt>
                <dd className="text-[15px] leading-relaxed text-gray-600">
                  Google Gemini, with Groq as backup. It can be confidently wrong, so check exam
                  dates and deadlines on official sites.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-serif text-[1.75rem] text-white">Start with your resume</h2>
            <p className="mt-1.5 text-[15px] text-[#9BA7BF]">
              Two minutes, no sign-up. The roadmap makes more sense once you have the score.
            </p>
          </div>
          <Link
            to="/analyze-resume"
            className="shrink-0 rounded-[4px] bg-crimson px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-crimson-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Analyze my resume
          </Link>
        </div>
      </section>
    </div>
  );
}
