interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const getColor = () => {
    if (score >= 80) return { stroke: "stroke-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" };
    if (score >= 60) return { stroke: "stroke-blue-500", text: "text-blue-600", bg: "bg-blue-50" };
    if (score >= 40) return { stroke: "stroke-amber-500", text: "text-amber-600", bg: "bg-amber-50" };
    return { stroke: "stroke-red-500", text: "text-red-600", bg: "bg-red-50" };
  };

  const getLabel = () => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Average";
    if (score >= 30) return "Below Average";
    return "Needs Work";
  };

  const colors = getColor();
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center flex-shrink-0">
      <div className={`rounded-full p-3 ${colors.bg}`}>
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200"
          />
          {/* Score arc */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={colors.stroke}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colors.text}`}>{score}</span>
          <span className="text-xs text-gray-500 font-medium">/100</span>
        </div>
      </div>
      <span className={`mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
        {getLabel()}
      </span>
    </div>
  );
}
