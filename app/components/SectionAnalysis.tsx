interface SectionItem {
  section: string;
  score: number;
  found: boolean;
  details: string;
  fix: string;
}

interface SectionAnalysisProps {
  sections: SectionItem[];
}

export function SectionAnalysis({ sections }: SectionAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-100";
    if (score >= 60) return "bg-blue-50 border-blue-100";
    if (score >= 40) return "bg-amber-50 border-amber-100";
    return "bg-red-50 border-red-100";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </span>
        Section-wise Analysis
      </h3>
      <div className="space-y-4">
        {sections.map((item, i) => (
          <div key={i} className={`p-4 rounded-xl border ${getScoreBg(item.score)} transition-all duration-200`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.found ? getScoreColor(item.score) : "bg-gray-400"}`} />
                <h4 className="font-semibold text-gray-900 text-sm">{item.section}</h4>
                {!item.found && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Missing</span>}
              </div>
              <span className="text-sm font-bold text-gray-700">{item.score}/100</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-200 rounded-full mb-3">
              <div className={`h-1.5 rounded-full ${getScoreColor(item.score)} transition-all duration-700`} style={{ width: `${item.score}%` }} />
            </div>
            {item.details && (
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium text-gray-800">Issue: </span>{item.details}
              </p>
            )}
            {item.fix && (
              <p className="text-sm text-emerald-700 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                <span className="font-medium">💡 Fix: </span>{item.fix}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
