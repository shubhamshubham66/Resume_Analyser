interface KeywordsAnalysisProps {
  found: string[];
  missing: string[];
}

export function KeywordsAnalysis({ found, missing }: KeywordsAnalysisProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-purple-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </span>
        ATS Keywords Analysis
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-emerald-700 mb-2 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
            Found in Resume ({found.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {found.slice(0, 20).map((kw, i) => (
              <span key={i} className="inline-block px-2.5 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-medium">
                {kw}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Should Add ({missing.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missing.slice(0, 20).map((kw, i) => (
              <span key={i} className="inline-block px-2.5 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
