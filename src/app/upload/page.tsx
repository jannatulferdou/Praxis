"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { apiService } from "@/services/api";
import { GeminiAnalysis } from "@/types/api";

type MediaMode = "video" | "image";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaMode, setMediaMode] = useState<MediaMode>("video");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "analysing" | "success">("idle");
  const [geminiAvailable, setGeminiAvailable] = useState<boolean | null>(null);
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);

  const isVideo = mediaMode === "video";
  const acceptStr = isVideo ? "video/*" : "image/jpeg,image/png,image/webp,image/gif";
  const maxSizeMB = isVideo ? 5 : 4;

  const switchMode = (mode: MediaMode) => {
    setMediaMode(mode);
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setAnalysis(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidVideo = isVideo && file.type.startsWith("video/");
    const isValidImage = !isVideo && file.type.startsWith("image/");

    if (!isValidVideo && !isValidImage) {
      setError(isVideo ? "Please select a valid video file" : "Please select a valid image file (JPG, PNG, WebP, GIF)");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be less than ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setAnalysis(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);
      setUploadStatus("uploading");

      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + Math.random() * 20;
          return next > 80 ? 80 : next;
        });
      }, 400);

      setUploadStatus("analysing");

      let response;
      if (isVideo) {
        response = await apiService.uploadVideo(selectedFile, userId);
      } else {
        response = await apiService.uploadImage(selectedFile, userId);
      }

      clearInterval(progressInterval);
      setUploadProgress(90);
      setGeminiAvailable(response.gemini_available);

      // Save processing ID for downstream pages
      if (response.processing_id) {
        localStorage.setItem("processingId", response.processing_id);
      }

      // Data is returned inline — no polling needed (serverless-safe)
      if (response.analysis) {
        setAnalysis(response.analysis);
        localStorage.setItem("geminiAnalysis", JSON.stringify(response.analysis));
      }
      if (response.skills) {
        localStorage.setItem("geminiSkills", JSON.stringify(response.skills));
      }
      if (response.jobs) {
        localStorage.setItem("geminiJobs", JSON.stringify(response.jobs));
      }

      setUploadProgress(100);
      setUploadStatus("success");
      setTimeout(() => router.push("/processing"), 3000);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setUploadStatus("idle");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-[#3A7D44]");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-[#3A7D44]");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-[#3A7D44]");
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current!.files = dataTransfer.files;
      handleFileSelect({ target: { files: dataTransfer.files } } as any);
    }
  };

  const confidencePct = analysis ? Math.round(analysis.confidence_score * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F7F9F4] dark:bg-gray-900 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3B18A]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3A7D44]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "linear-gradient(0deg,transparent 24%,rgba(58,125,68,0.05) 25%,rgba(58,125,68,0.05) 26%,transparent 27%,transparent 74%,rgba(58,125,68,0.05) 75%,rgba(58,125,68,0.05) 76%,transparent 77%,transparent),linear-gradient(90deg,transparent 24%,rgba(58,125,68,0.05) 25%,rgba(58,125,68,0.05) 26%,transparent 27%,transparent 74%,rgba(58,125,68,0.05) 75%,rgba(58,125,68,0.05) 76%,transparent 77%,transparent)",
        backgroundSize: "50px 50px",
      }} />

      <div className="relative max-w-2xl mx-auto px-4 py-4 sm:py-6">
        {/* Theme toggle */}
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="business-svgrepo-com" size={32} color="#3A7D44" />
            <h1 className="text-2xl font-bold text-[#344E41] dark:text-gray-100">Upload Media</h1>
          </div>
          <p className="text-sm text-[#344E41]/70 dark:text-gray-300">
            Upload a video or image — Gemini AI will extract your skills automatically.
          </p>
        </div>

        {/* Gemini status badge */}
        {geminiAvailable !== null && (
          <div className={`mb-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border ${
            geminiAvailable
              ? "bg-emerald-500/10 border-emerald-400/40 text-emerald-700 dark:text-emerald-400"
              : "bg-amber-500/10 border-amber-400/40 text-amber-700 dark:text-amber-400"
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${geminiAvailable ? "bg-emerald-500" : "bg-amber-500"}`} />
            {geminiAvailable
              ? "Gemini AI is active — real skill analysis enabled"
              : "Gemini not configured — showing mock results (add GEMINI_API_KEY to .env.local)"}
          </div>
        )}

        {/* Mode switcher */}
        <div className="flex gap-2 mb-6 p-1 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-[#A3B18A]/30 dark:border-gray-700 backdrop-blur-sm">
          {(["video", "image"] as MediaMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => switchMode(mode)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mediaMode === mode
                  ? "bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] text-white shadow-md"
                  : "text-[#344E41]/70 dark:text-gray-400 hover:bg-[#3A7D44]/10"
              }`}
            >
              <Icon
                name={mode === "video" ? "upload-svgrepo-com" : "arrow-circle-right-svgrepo-com"}
                size={18}
                color={mediaMode === mode ? "white" : "#3A7D44"}
              />
              {mode === "video" ? "Video" : "Image / Certificate"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex gap-3 items-start">
            <Icon name="warning-circle-svgrepo-com" size={20} color="#EF4444" className="flex-shrink-0 mt-0.5" />
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-5">
          {/* Drop zone */}
          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#A3B18A]/50 dark:border-gray-600 rounded-xl p-10 text-center bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm cursor-pointer hover:border-[#3A7D44] hover:bg-[#3A7D44]/5 transition-all duration-200"
            >
              <Icon
                name={isVideo ? "upload-svgrepo-com" : "arrow-circle-right-svgrepo-com"}
                size={52}
                color="#3A7D44"
                className="mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-[#344E41] dark:text-gray-100 mb-2">
                {isVideo ? "Drop video here or click to browse" : "Drop image here or click to browse"}
              </h3>
              <p className="text-sm text-[#344E41]/60 dark:text-gray-400 mb-1">
                {isVideo ? "MP4, WebM, MOV, AVI — max 5 MB" : "JPG, PNG, WebP, GIF — max 4 MB"}
              </p>
              <p className="text-xs text-[#3A7D44] dark:text-[#A3B18A] font-medium">
                ✦ Gemini AI will analyse your {isVideo ? "video" : "image"} automatically
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptStr}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <>
              {/* File info */}
              <div className="bg-emerald-500/10 dark:bg-emerald-900/20 border border-emerald-400/40 rounded-xl p-4 flex items-center gap-3">
                <Icon name="check-circle-svgrepo-com" size={24} color="#10B981" />
                <div className="flex-1">
                  <p className="font-semibold text-[#344E41] dark:text-gray-100 text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-[#344E41]/60 dark:text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · {selectedFile.type}
                  </p>
                </div>
              </div>

              {/* Preview */}
              {preview && (
                <div className="rounded-xl overflow-hidden border border-[#A3B18A]/30 dark:border-gray-700 bg-black">
                  {isVideo ? (
                    <video src={preview} controls className="w-full max-h-64 object-contain" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Preview" className="w-full max-h-64 object-contain" />
                  )}
                </div>
              )}

              {/* Progress */}
              {uploadStatus !== "idle" && (
                <div className="space-y-3 p-4 bg-white/40 dark:bg-gray-800/40 rounded-xl border border-[#A3B18A]/30 dark:border-gray-700 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    {uploadStatus === "success" ? (
                      <>
                        <Icon name="check-circle-svgrepo-com" size={22} color="#10B981" />
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                          {analysis ? "Gemini analysis complete!" : "Upload complete!"}
                        </span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 animate-spin text-[#3A7D44]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="font-semibold text-[#3A7D44] dark:text-[#A3B18A] text-sm">
                          {uploadStatus === "analysing" ? `Gemini is analysing your ${isVideo ? "video" : "image"}…` : "Uploading…"}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        uploadStatus === "success" ? "bg-emerald-500" : "bg-gradient-to-r from-[#3A7D44] to-[#A3B18A]"
                      }`}
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-[#344E41]/60 dark:text-gray-400">
                    <span>
                      {uploadStatus === "uploading" ? "Transferring…" : uploadStatus === "analysing" ? "AI processing…" : "Done"}
                    </span>
                    <span className="font-semibold">{Math.round(uploadProgress)}%</span>
                  </div>
                </div>
              )}

              {/* Gemini analysis result card */}
              {analysis && (
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#3A7D44]/5 to-[#A3B18A]/5 border border-[#3A7D44]/30 dark:border-[#A3B18A]/30 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✦</span>
                    <h3 className="font-bold text-[#344E41] dark:text-gray-100 text-sm">Gemini AI Analysis</h3>
                    <span className="ml-auto text-xs px-2 py-0.5 bg-[#3A7D44]/10 rounded-full text-[#3A7D44] dark:text-[#A3B18A] font-semibold">
                      {confidencePct}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-[#344E41]/80 dark:text-gray-300 leading-relaxed">{analysis.summary}</p>
                  {analysis.detected_skills.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[#3A7D44] dark:text-[#A3B18A] uppercase tracking-wide mb-2">Detected Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.detected_skills.map((skill) => (
                          <span key={skill} className="px-2.5 py-1 bg-[#3A7D44]/10 border border-[#3A7D44]/20 rounded-full text-xs font-medium text-[#344E41] dark:text-gray-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4 text-xs text-[#344E41]/60 dark:text-gray-400">
                    {analysis.language_detected && (
                      <span>🌐 Language: <strong className="text-[#344E41] dark:text-gray-300">{analysis.language_detected}</strong></span>
                    )}
                    <span>📁 Media: <strong className="text-[#344E41] dark:text-gray-300">{analysis.media_type}</strong></span>
                  </div>
                  {analysis.raw_transcript && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-[#3A7D44] dark:text-[#A3B18A] font-semibold">View transcript</summary>
                      <p className="mt-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg text-[#344E41]/70 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                        {analysis.raw_transcript}
                      </p>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    setUploadProgress(0);
                    setUploadStatus("idle");
                    setAnalysis(null);
                  }}
                  disabled={loading}
                  className="px-6 py-3 bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 disabled:opacity-50 border border-[#A3B18A]/40 dark:border-gray-600 text-[#344E41] dark:text-gray-100 font-semibold rounded-lg transition-all text-sm"
                >
                  Change File
                </button>
                <button
                  onClick={handleUpload}
                  disabled={loading || uploadStatus === "success" || uploadStatus === "analysing"}
                  className="px-6 py-3 bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] disabled:opacity-50 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {loading || uploadStatus === "uploading" || uploadStatus === "analysing" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {uploadStatus === "analysing" ? "Analysing…" : "Uploading…"}
                    </>
                  ) : uploadStatus === "success" ? (
                    "✓ Done"
                  ) : (
                    <>
                      <Icon name="upload-svgrepo-com" size={16} color="white" />
                      Analyse with Gemini
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Info box */}
          <div className="bg-[#A3B18A]/10 dark:bg-gray-800/50 border border-[#A3B18A]/30 dark:border-gray-700 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex gap-3 items-start">
              <Icon name="notify-svgrepo-com" size={18} color="#3A7D44" className="flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#344E41]/70 dark:text-gray-300 space-y-1">
                <p className="font-semibold text-[#344E41] dark:text-gray-100 mb-1">Gemini AI capabilities:</p>
                <p>✦ Video — transcribes speech, identifies demonstrated techniques</p>
                <p>✦ Image — reads certificates, work photos, diplomas, ID cards</p>
                <p>✦ Supports Bangla, English, and code-switching</p>
                <p>✦ Matches extracted skills to live job opportunities</p>
              </div>
            </div>
          </div>

          {/* Back */}
          <button
            onClick={() => router.push("/start")}
            className="w-full px-4 py-2 text-[#344E41]/60 dark:text-gray-400 hover:text-[#344E41] dark:hover:text-gray-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Icon name="arrow-left-svgrepo-com" size={16} color="#94A3B8" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
