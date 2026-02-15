"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { apiService } from "@/services/api";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success">("idle");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError("Video file must be less than 100MB");
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a video file");
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
        return;
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + Math.random() * 25;
          return next > 85 ? 85 : next;
        });
      }, 400);

      // Upload file
      const response = await apiService.uploadVideo(selectedFile, userId);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus("success");

      if (response.processing_id) {
        localStorage.setItem("processingId", response.processing_id);
        setTimeout(() => {
          router.push("/processing");
        }, 1500);
      }
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
    e.currentTarget.classList.add("bg-[#3A7D44]500/30");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-[#3A7D44]500/30");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-[#3A7D44]500/30");
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current!.files = dataTransfer.files;
      handleFileSelect({ target: { files: dataTransfer.files } } as any);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F4] dark:bg-gray-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3B18A]/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3A7D44]/5 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animation: "float 8s ease-in-out infinite 1s" }} />
      </div>

      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent)",
        backgroundSize: "50px 50px"
      }} />

      <div className="relative max-w-2xl mx-auto px-4 py-4 sm:py-6">
        {/* ThemeToggle in top-right corner */}
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="business-svgrepo-com" size={32} color="#3A7D44" />
            <h1 className="text-2xl font-bold text-white dark:text-gray-100">Upload Video</h1>
          </div>
          <p className="text-sm text-[#344E41]/8000 dark:text-gray-300">Upload a pre-recorded video to verify your skills</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <div className="flex gap-3 items-start">
              <Icon name="warning-circle-svgrepo-com" size={20} color="#EF4444" className="flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {/* Upload Area */}
          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-2 border-dashed border-[#A3B18A]00/50 dark:border-gray-700 rounded-xl p-8 text-center bg-white/30 dark:bg-gray-800/30 transition-colors duration-200 cursor-pointer hover:border-[#A3B18A]00 dark:hover:border-gray-600 hover:bg-[#3A7D44]500/10 dark:hover:bg-gray-700/50 backdrop-blur-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="upload-svgrepo-com" size={48} color="#3A7D44" className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white dark:text-gray-100 mb-2">Drop video here or click to browse</h3>
              <p className="text-sm text-[#344E41]/6000 dark:text-gray-400 mb-4">
                Supports MP4, WebM, and other common video formats (max 100MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <>
              {/* Selected File Info */}
              <div className="bg-emerald-500/20 dark:bg-emerald-900/30 border border-emerald-400/50 dark:border-emerald-700 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <Icon name="document-svgrepo-com" size={24} color="#10B981" className="flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-white dark:text-gray-100">{selectedFile.name}</p>
                    <p className="text-sm text-[#344E41]/6000 dark:text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Icon name="check-circle-svgrepo-com" size={24} color="#10B981" />
                </div>
              </div>

              {/* Video Preview */}
              {preview && (
                <div className="rounded-lg overflow-hidden bg-black aspect-video border border-[#A3B18A]00/50 dark:border-gray-700">
                  <video
                    src={preview}
                    controls
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
              )}

              {/* Upload Progress */}
              {uploadStatus !== "idle" && (
                <div className="space-y-3 p-4 bg-white/30 dark:bg-gray-800/30 rounded-lg border border-[#A3B18A]00/50 dark:border-gray-700 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    {uploadStatus === "success" ? (
                      <>
                        <Icon name="check-circle-svgrepo-com" size={24} color="#10B981" />
                        <span className="font-semibold text-emerald-300 dark:text-emerald-400">Upload Complete!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 animate-spin text-[#3A7D44]00 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="font-semibold text-[#3A7D44]00 dark:text-blue-400">Uploading...</span>
                      </>
                    )}
                  </div>

                  <div className="w-full bg-slate-700/50 dark:bg-gray-600/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        uploadStatus === "success" ? "bg-emerald-500" : "bg-[#3A7D44]500 dark:bg-blue-500"
                      }`}
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-[#344E41]/6000 dark:text-gray-400">
                    <span>Transferring video...</span>
                    <span className="font-semibold text-[#344E41]/8000 dark:text-gray-300">{Math.round(uploadProgress)}%</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    setUploadProgress(0);
                    setUploadStatus("idle");
                  }}
                  disabled={loading}
                  className="px-6 py-3 bg-slate-700/50 dark:bg-gray-700/50 hover:bg-slate-700 dark:hover:bg-gray-600 disabled:bg-slate-600 dark:disabled:bg-gray-700 border border-slate-600/50 dark:border-gray-600 text-white dark:text-gray-100 font-semibold rounded-lg transition-all"
                >
                  Change File
                </button>

                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] disabled:from-slate-500 disabled:to-slate-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Icon name="upload-svgrepo-com" size={18} color="white" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Info Box */}
          <div className="bg-[#A3B18A]/10 dark:bg-gray-800/50 border border-[#A3B18A]00/50 dark:border-gray-700 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex gap-3 items-start">
              <Icon name="notify-svgrepo-com" size={20} color="#3A7D44" className="flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[#3A7D44]100 dark:text-gray-300">
                <p className="font-semibold mb-1">Requirements:</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ Video format: MP4, WebM, or other common formats</li>
                  <li>✓ Maximum file size: 100MB</li>
                  <li>✓ Your video will be processed automatically</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.push("/start")}
            className="w-full px-4 py-2 text-[#344E41]/6000 dark:text-gray-400 hover:text-[#344E41]/8000 dark:hover:text-gray-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Icon name="arrow-left-svgrepo-com" size={18} color="#94A3B8" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
