import { ResumeAnalyzer } from "~/components/ResumeAnalyzer";

export function meta() {
  return [
    { title: "AI Resume Analyzer" },
    {
      name: "description",
      content:
        "Upload your resume PDF and get an ATS-style score, summary, and improvement suggestions.",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            AI Resume Analyzer
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Analyze Your Resume
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your resume PDF to get an instant ATS compatibility score,
            detailed summary, and actionable suggestions to improve your chances
            of landing interviews.
          </p>
        </div>
        <ResumeAnalyzer />
      </main>

      <footer className="border-t border-gray-200 bg-white/80 mt-12">
        <div className="mx-auto max-w-5xl px-4 py-4 text-center text-sm text-gray-500">
          AI Resume Analyzer &mdash; Client-side PDF processing, your data never
          leaves your browser.
        </div>
      </footer>
    </div>
  );
}
