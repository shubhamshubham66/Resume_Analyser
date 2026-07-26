import { useCallback } from "react";
import { useAppStore } from "~/lib/store";
import { parsePDF } from "~/lib/pdf-parser";
import { analyzeResume } from "~/lib/analyzer";
import { FileUpload } from "./FileUpload";
import { ScoreBadge } from "./ScoreBadge";
import { AnalysisResults } from "./AnalysisResults";
import { LoadingSpinner } from "./LoadingSpinner";

export function ResumeAnalyzer() {
  const { file, analysis, status, error, reset } = useAppStore();
  const setFile = useAppStore((s) => s.setFile);
  const setParsedResume = useAppStore((s) => s.setParsedResume);
  const setAnalysis = useAppStore((s) => s.setAnalysis);
  const setStatus = useAppStore((s) => s.setStatus);
  const setError = useAppStore((s) => s.setError);

  const handleFileAccepted = useCallback(
    async (acceptedFile: File) => {
      try {
        reset();
        setFile(acceptedFile);
        setStatus("parsing");

        const parsed = await parsePDF(acceptedFile);
        setParsedResume(parsed);

        setStatus("analyzing");
        const result = analyzeResume(parsed);
        setAnalysis(result);

        setStatus("done");
      } catch (err) {
        console.error("Analysis failed:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to analyze resume. Please try a different PDF."
        );
      }
    },
    [reset, setFile, setStatus, setParsedResume, setAnalysis, setError]
  );

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <FileUpload onFileAccepted={handleFileAccepted} disabled={status === "parsing" || status === "analyzing"} />

      {/* Status Messages */}
      {status === "parsing" && (
        <LoadingSpinner message="Parsing PDF..." />
      )}
      {status === "analyzing" && (
        <LoadingSpinner message="Analyzing resume..." />
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={reset}
            className="mt-3 text-sm font-medium text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Results */}
      {status === "done" && analysis && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreBadge score={analysis.score} />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  ATS Compatibility Score
                </h3>
                <p className="text-gray-600 text-sm">{analysis.summary}</p>
              </div>
              <button
                onClick={reset}
                className="text-sm font-medium text-primary hover:text-primary-dark px-4 py-2 border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
              >
                Analyze Another
              </button>
            </div>
          </div>

          <AnalysisResults analysis={analysis} />

          {file && (
            <p className="text-center text-xs text-gray-400">
              Analyzed: {file.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
