interface SuggestionsListProps {
  suggestions: string[];
}

export function SuggestionsList({ suggestions }: SuggestionsListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-emerald-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </span>
        Actionable Suggestions
        <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
          {suggestions.length} tips
        </span>
      </h3>
      <ol className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/40 border border-emerald-100 transition-all duration-200 hover:shadow-sm hover:from-emerald-50 hover:to-teal-50/60"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
              {index + 1}
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">{suggestion}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
