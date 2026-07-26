interface Improvement {
  area: string;
  current: string;
  suggested: string;
  why: string;
}

interface ImprovementCardsProps {
  improvements: Improvement[];
}

export function ImprovementCards({ improvements }: ImprovementCardsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-emerald-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </span>
        How to Improve (Before → After)
        <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
          {improvements.length} rewrites
        </span>
      </h3>
      <div className="space-y-4">
        {improvements.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.area}</span>
            </div>
            <div className="p-4 space-y-3">
              {/* Current */}
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                  <span className="text-red-500 text-xs">✗</span>
                </span>
                <div>
                  <p className="text-xs font-medium text-red-600 mb-0.5">Currently says:</p>
                  <p className="text-sm text-gray-700 bg-red-50 px-3 py-2 rounded-lg border border-red-100 italic">"{item.current}"</p>
                </div>
              </div>
              {/* Suggested */}
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                  <span className="text-emerald-500 text-xs">✓</span>
                </span>
                <div>
                  <p className="text-xs font-medium text-emerald-600 mb-0.5">Change to:</p>
                  <p className="text-sm text-gray-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 font-medium">"{item.suggested}"</p>
                </div>
              </div>
              {/* Why */}
              {item.why && (
                <p className="text-xs text-gray-500 pl-7 italic">↳ {item.why}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
