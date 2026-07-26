interface AnalysisSkeletonProps {
  status: "uploading" | "analyzing";
}

export function AnalysisSkeleton({ status }: AnalysisSkeletonProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        {/* Animated spinner */}
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {status === "uploading" ? "Uploading Resume..." : "Analyzing with AI..."}
        </h3>
        <p className="text-sm text-gray-500">
          {status === "uploading"
            ? "Sending your resume to the server"
            : "Grok AI is reviewing your resume. This may take a few seconds."}
        </p>
      </div>

      {/* Skeleton blocks */}
      <div className="space-y-4">
        {/* Score skeleton */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
          <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded-full w-1/2 animate-pulse" style={{ animationDelay: "100ms" }} />
          </div>
        </div>

        {/* Cards skeleton */}
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="h-3 bg-gray-200 rounded-full w-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
              <div className="h-3 bg-gray-200 rounded-full w-2/3 mt-2 animate-pulse" style={{ animationDelay: `${i * 150 + 75}ms` }} />
            </div>
          ))}
        </div>

        {/* List skeleton */}
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded-full w-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 flex items-center justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
