interface WeakPointsProps {
  title: string;
  items: string[];
  color: "red" | "orange" | "yellow";
}

const colorMap = {
  red: {
    card: "bg-red-50 border-red-100",
    badge: "bg-red-100 text-red-700",
    icon: "text-red-500",
    title: "text-red-900",
  },
  orange: {
    card: "bg-orange-50 border-orange-100",
    badge: "bg-orange-100 text-orange-700",
    icon: "text-orange-500",
    title: "text-orange-900",
  },
  yellow: {
    card: "bg-amber-50 border-amber-100",
    badge: "bg-amber-100 text-amber-700",
    icon: "text-amber-500",
    title: "text-amber-900",
  },
};

const iconMap = {
  red: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  orange: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  yellow: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function WeakPoints({ title, items, color }: WeakPointsProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className={`text-base font-semibold ${colors.title} mb-4 flex items-center gap-2`}>
        <span className={colors.icon}>{iconMap[color]}</span>
        {title}
        <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
          {items.length} {items.length === 1 ? "issue" : "issues"}
        </span>
      </h3>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 p-3 rounded-xl border ${colors.card} transition-all duration-200 hover:shadow-sm`}
          >
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${colors.badge}`}>
              {index + 1}
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
