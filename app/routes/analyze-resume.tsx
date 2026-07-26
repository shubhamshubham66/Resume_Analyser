import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ScoreGauge } from "~/components/ScoreGauge";
import { WeakPoints } from "~/components/WeakPoints";
import { SuggestionsList } from "~/components/SuggestionsList";
import { AnalysisSkeleton } from "~/components/AnalysisSkeleton";

export function meta() {
  return [
    { title: "Analyze Resume - AI Resume Analyzer" },
    {
      name: "description",
      content:
        "Upload your resume (PDF or DOCX) and get AI-powered analysis with score, weak points, and actionable suggestions.",
    },
  ];
}

interface AnalysisResult {
  overall_score: number;
  weak_points: string[];
  missing_skills_or_sections: string[];
  formatting_issues: string[];
  suggestions: string[];
}

export default function AnalyzeResume() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ACCEPTED_TYPES = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === "file-too-large") {
        setError("File size exceeds 5MB limit. Please upload a smaller file.");
      } else if (rejection.errors[0]?.code === "file-invalid-type") {
        setError("Invalid file type. Only PDF and DOCX files are accepted.");
      } else {
        setError("Invalid file. Please upload a PDF or DOCX file (max 5MB).");
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: status === "uploading" || status === "analyzing",
  });

  const handleAnalyze = async () => {
    if (!file) return;

    setStatus("uploading");
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      setStatus("analyzing");

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Analysis failed (HTTP ${response.status})`);
      }

      const data = await response.json();
      setResult(data);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setError(null);
    setResult(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Powered by Grok AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Analyze Your Resume
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg">
            Upload your resume and get an AI-powered analysis with ATS score,
            weak points, and actionable improvement suggestions.
          </p>
        </div>

        {/* Upload Section */}
        {status !== "done" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer 
                transition-all duration-300 ease-out
                ${isDragActive 
                  ? "border-blue-500 bg-blue-50 scale-[1.01] shadow-lg shadow-blue-100" 
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
                }
                ${status === "uploading" || status === "analyzing" ? "opacity-50 pointer-events-none" : ""}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isDragActive ? "bg-blue-200 scale-110" : "bg-blue-100"
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-8 h-8 transition-colors duration-300 ${isDragActive ? "text-blue-700" : "text-blue-500"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                {isDragActive ? (
                  <div>
                    <p className="text-blue-700 font-semibold text-lg">Drop your resume here</p>
                    <p className="text-blue-500 text-sm mt-1">Release to upload</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-800 font-semibold text-lg">
                      Drag & drop your resume here
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      or <span className="text-blue-600 font-medium underline underline-offset-2">click to browse</span>
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        PDF or DOCX
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Max 5MB
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Selected File */}
            {file && status !== "analyzing" && status !== "uploading" && (
              <div className="mt-5 flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleReset(); }}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">{error}</p>
                  <button
                    onClick={handleReset}
                    className="text-xs text-red-600 hover:text-red-800 underline mt-1"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            {file && status !== "analyzing" && status !== "uploading" && (
              <button
                onClick={handleAnalyze}
                disabled={!file}
                className="mt-6 w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Analyze with AI
                </span>
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {(status === "uploading" || status === "analyzing") && (
          <AnalysisSkeleton status={status} />
        )}

        {/* Results */}
        {status === "done" && result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Score Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ScoreGauge score={result.overall_score} />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Resume Analysis Complete</h2>
                  <p className="text-gray-600 text-sm">
                    {result.overall_score >= 8
                      ? "Excellent! Your resume is well-optimized and ready for ATS systems."
                      : result.overall_score >= 6
                      ? "Good foundation! A few improvements will significantly boost your chances."
                      : result.overall_score >= 4
                      ? "Needs improvement. Focus on the suggestions below to strengthen your resume."
                      : "Your resume needs significant work. Follow the suggestions carefully."}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Analyze Another
                </button>
              </div>
            </div>

            {/* Weak Points */}
            {result.weak_points.length > 0 && (
              <WeakPoints
                title="Weak Points"
                items={result.weak_points}
                color="red"
              />
            )}

            {/* Missing Skills/Sections */}
            {result.missing_skills_or_sections.length > 0 && (
              <WeakPoints
                title="Missing Skills or Sections"
                items={result.missing_skills_or_sections}
                color="orange"
              />
            )}

            {/* Formatting Issues */}
            {result.formatting_issues.length > 0 && (
              <WeakPoints
                title="Formatting Issues"
                items={result.formatting_issues}
                color="yellow"
              />
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <SuggestionsList suggestions={result.suggestions} />
            )}

            {/* Analyzed File Info */}
            {file && (
              <p className="text-center text-xs text-gray-400 pt-2">
                Analyzed: {file.name}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
