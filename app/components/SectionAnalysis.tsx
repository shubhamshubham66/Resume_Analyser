interface SectionItem {
  section: string;
  score: number;
  found: boolean;
  details: string;
  fix: string;
}

export function SectionAnalysis({ sections }: { sections: SectionItem[] }) {
  const getColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        📋 Section-wise Analysis
      </h3>
      <div className="space-y-4">
        {sections.map((item, i) => (
          <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.found ? getColor(item.score) : "bg-gray-400"}`} />
                {item.section}
                {!item.found && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Missing</span>}
              </h4>
              <span className="text-sm font-bold text-gray-700">{item.score}/100</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full mb-3">
              <div className={`h-1.5 rounded-full ${getColor(item.score)} transition-all duration-700`} style={{ width: `${item.score}%` }} />
            </div>
            {item.details && <p className="text-sm text-gray-700 mb-2">{item.details}</p>}
            {item.fix && (
              <p className="text-sm text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                💡 {item.fix}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
