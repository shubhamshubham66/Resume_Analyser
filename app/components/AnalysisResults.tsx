import type { AnalysisResult } from "~/lib/analyzer";

interface AnalysisResultsProps {
  analysis: AnalysisResult;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Sections Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Sections Found
        </h4>
        <div className="space-y-3">
          {analysis.sections.map((section) => (
            <div key={section.name} className="flex items-center gap-3">
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${
                  section.found ? "bg-green-500" : "bg-red-400"
                }`}
              >
                {section.found ? "✓" : "✗"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  {section.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {section.feedback}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Suggestions
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {analysis.suggestions.map((suggestion, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg text-sm ${
                suggestion.type === "positive"
                  ? "bg-green-50 text-green-800 border border-green-100"
                  : suggestion.type === "warning"
                  ? "bg-red-50 text-red-800 border border-red-100"
                  : "bg-amber-50 text-amber-800 border border-amber-100"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">
                  {suggestion.type === "positive"
                    ? "✓"
                    : suggestion.type === "warning"
                    ? "⚠"
                    : "💡"}
                </span>
                <span>{suggestion.text}</span>
              </div>
              {suggestion.priority === "high" && (
                <span className="inline-block mt-1 ml-5 text-xs font-medium px-1.5 py-0.5 rounded bg-white/50">
                  High Priority
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:col-span-2">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Keywords Analysis
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-green-700 mb-2">
              Found ({analysis.keywords.found.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.keywords.found.slice(0, 20).map((kw) => (
                <span
                  key={kw}
                  className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700"
                >
                  {kw}
                </span>
              ))}
              {analysis.keywords.found.length > 20 && (
                <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">
                  +{analysis.keywords.found.length - 20} more
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-red-700 mb-2">
              Consider Adding
            </p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.keywords.missing.map((kw) => (
                <span
                  key={kw}
                  className="inline-block px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
