import { Link } from "react-router";

export function meta() {
  return [
    { title: "ResumeAI - Free ATS Resume Scanner & Analyzer" },
    { name: "description", content: "Optimize your resume to get more interviews. AI-powered ATS score, skills analysis, and actionable suggestions." },
  ];
}

export default function Home() {
  return (
    <div>
      {/* Hero Banner - Jobscan Style */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-800/20 rounded-full blur-3xl" />
          <div className="absolute top-10 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left - Text Content */}
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-tight mb-6">
                Optimize your resume to get more interviews
              </h1>
              <p className="text-blue-100 text-lg sm:text-xl mb-8 leading-relaxed max-w-lg">
                ResumeAI analyzes your resume with AI, highlighting ATS compatibility score, missing skills, and exactly how to improve each section.
              </p>
              <Link
                to="/analyze-resume"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 text-base font-bold rounded-full shadow-xl shadow-blue-900/20 hover:shadow-blue-900/30 hover:bg-blue-50 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Check my Resume for Free
              </Link>
              <div className="flex items-center gap-5 mt-8 text-blue-200 text-sm">
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Free to use
                </span>
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Instant results
                </span>
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  PDF & DOCX
                </span>
              </div>
            </div>

            {/* Right - Dashboard Mockup */}
            <div className="hidden lg:block relative">
              <div className="bg-white rounded-2xl shadow-2xl p-5 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Mockup Header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-gray-400 font-mono">resumeai.app/results</span>
                </div>
                {/* Match Rate */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-400 flex items-center justify-center">
                    <span className="text-lg font-bold text-emerald-600">85</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">ATS Score</p>
                    <p className="text-xs text-gray-500">Your resume is well-optimized</p>
                  </div>
                </div>
                {/* Sections preview */}
                <div className="space-y-2.5">
                  {[
                    { name: "Hard Skills", score: 90, color: "bg-emerald-400" },
                    { name: "Experience", score: 75, color: "bg-blue-400" },
                    { name: "Formatting", score: 85, color: "bg-emerald-400" },
                    { name: "Searchability", score: 60, color: "bg-amber-400" },
                    { name: "Soft Skills", score: 70, color: "bg-blue-400" },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-24 font-medium">{item.name}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 w-8">{item.score}%</span>
                    </div>
                  ))}
                </div>
                {/* Green checkmark */}
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Analyze - 7 Sections */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What We Analyze
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI scans 7 critical areas of your resume to give you a complete picture of how ATS systems see your application
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🎯", title: "ATS Score", desc: "Overall compatibility score out of 100 based on ATS parsing standards", color: "from-blue-50 to-indigo-50", border: "border-blue-100" },
              { icon: "💻", title: "Hard Skills", desc: "Technical skills, tools, and technologies found vs missing from your resume", color: "from-emerald-50 to-teal-50", border: "border-emerald-100" },
              { icon: "🤝", title: "Soft Skills", desc: "Communication, leadership, and interpersonal skills analysis", color: "from-purple-50 to-pink-50", border: "border-purple-100" },
              { icon: "🔍", title: "Searchability", desc: "Section headings, file format, and how easily ATS can parse your content", color: "from-amber-50 to-orange-50", border: "border-amber-100" },
              { icon: "📐", title: "Formatting", desc: "Layout, fonts, margins, bullet points, and visual structure analysis", color: "from-red-50 to-rose-50", border: "border-red-100" },
              { icon: "📋", title: "Section Analysis", desc: "Individual score for Experience, Education, Skills, Projects, Summary", color: "from-cyan-50 to-sky-50", border: "border-cyan-100" },
              { icon: "✏️", title: "Improvements", desc: "Before → After rewrite suggestions with exact text you can copy-paste", color: "from-green-50 to-emerald-50", border: "border-green-100" },
            ].map((item) => (
              <div
                key={item.title}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 border ${item.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "Upload Resume", desc: "Drag & drop your PDF or DOCX file", icon: "📄" },
              { step: "2", title: "AI Analysis", desc: "Our AI scans all 7 sections in seconds", icon: "⚡" },
              { step: "3", title: "Get Report", desc: "Detailed scores, issues & rewrite suggestions", icon: "📊" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-200">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/analyze-resume"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-base font-bold rounded-full shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Analyze My Resume Now
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* What ResumeAI Does */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What ResumeAI Does
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered tool helps you understand exactly how recruiters and ATS systems see your resume
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: "Identifies Missing Keywords",
                desc: "Compares your resume against industry-standard ATS keywords and shows exactly which technical and soft skills you're missing.",
                icon: "🔑",
              },
              {
                title: "Scores Every Section",
                desc: "Each section of your resume (Experience, Skills, Education, Projects) gets an individual score so you know where to focus.",
                icon: "📊",
              },
              {
                title: "Provides Exact Rewrites",
                desc: "Instead of generic advice, we show you exactly how to rewrite weak bullet points with Before → After examples you can copy-paste.",
                icon: "✏️",
              },
              {
                title: "Checks ATS Compatibility",
                desc: "Ensures your resume format, headings, and structure are optimized for Applicant Tracking Systems used by 99% of companies.",
                icon: "🤖",
              },
              {
                title: "Highlights Formatting Issues",
                desc: "Detects problems like missing contact info, inconsistent dates, poor bullet point structure, and length issues.",
                icon: "📐",
              },
              {
                title: "100% Free & Private",
                desc: "No sign-up required. Your resume data is never stored — processed in real-time and immediately discarded.",
                icon: "🔒",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Reviews */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              What Our Users Are Saying
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                stars: 5,
                title: "Got me 3 interviews!",
                text: "I uploaded my resume and followed the suggestions. Within a week, I got 3 interview calls. The Before→After rewrites were game-changing.",
                name: "Priya S.",
                date: "Jul 2026",
              },
              {
                stars: 5,
                title: "Best free tool",
                text: "I've tried many resume scanners but this one actually shows you what's wrong AND how to fix it. The keyword analysis is spot on.",
                name: "Rahul M.",
                date: "Jul 2026",
              },
              {
                stars: 4,
                title: "Very detailed analysis",
                text: "The section-wise scoring helped me understand my weak areas. My resume score went from 42 to 78 after making the suggested changes.",
                name: "Ankit K.",
                date: "Jun 2026",
              },
              {
                stars: 5,
                title: "Exactly what I needed",
                text: "As a fresher, I had no idea my resume was ATS-unfriendly. This tool showed me missing sections and skills I should add. Highly recommend!",
                name: "Sneha R.",
                date: "Jun 2026",
              },
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${j < review.stars ? "text-yellow-400" : "text-gray-200"}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {/* Title */}
                <h4 className="font-bold text-gray-900 text-sm mb-2">{review.title}</h4>
                {/* Text */}
                <p className="text-xs text-gray-600 leading-relaxed mb-4">{review.text}</p>
                {/* Author */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{review.name}</span> · {review.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to optimize your resume?
          </h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Upload your resume now and get a detailed AI analysis in seconds. It's free, no sign-up required.
          </p>
          <Link
            to="/analyze-resume"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 text-base font-bold rounded-full shadow-xl hover:bg-blue-50 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Check my Resume for Free
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
