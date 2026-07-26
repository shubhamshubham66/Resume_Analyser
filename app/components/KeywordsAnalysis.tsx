export function KeywordsAnalysis({ found, missing }: { found: string[]; missing: string[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">🏷️ ATS Keywords</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-emerald-700 mb-2">✓ Found ({found.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {found.slice(0, 20).map((kw, i) => (
              <span key={i} className="px-2.5 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-medium">{kw}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-red-700 mb-2">+ Should Add ({missing.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {missing.slice(0, 20).map((kw, i) => (
              <span key={i} className="px-2.5 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">{kw}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
