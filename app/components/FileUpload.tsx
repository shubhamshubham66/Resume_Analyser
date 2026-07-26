import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}

export function FileUpload({ onFileAccepted, disabled }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024, // 10MB
      disabled,
    });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-primary"
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
            <p className="text-primary font-medium">Drop your resume here...</p>
          ) : (
            <>
              <p className="text-gray-700 font-medium">
                Drag & drop your resume PDF here
              </p>
              <p className="text-gray-500 text-sm">
                or click to browse files (max 10MB)
              </p>
            </>
          )}
        </div>
      </div>
      {fileRejections.length > 0 && (
        <p className="mt-2 text-sm text-red-600">
          Please upload a valid PDF file (max 10MB).
        </p>
      )}
    </div>
  );
}
