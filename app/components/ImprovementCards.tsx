interface Improvement {
  area: string;
  current: string;
  suggested: string;
  why: string;
}

export function ImprovementCards({ improvements }: { improvements: Improvement[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        ✏️ How to Improve (Before → After)
      </h3>
      <div className="space-y-4">
        {improvements.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-xs font-bold text-gray-500 uppercase">{item.area}</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs">✗</span>
                <div>
                  <p className="text-xs font-medium text-red-600 mb-0.5">Currently:</p>
                  <p className="text-sm text-gray-700 bg-red-50 px-3 py-2 rounded-lg border border-red-100 italic">"{item.current}"</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 text-xs">✓</span>
                <div>
                  <p className="text-xs font-medium text-emerald-600 mb-0.5">Change to:</p>
                  <p className="text-sm text-gray-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 font-medium">"{item.suggested}"</p>
                </div>
              </div>
              {item.why && <p className="text-xs text-gray-500 pl-7 italic">↳ {item.why}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
