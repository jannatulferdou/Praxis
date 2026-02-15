"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { validateVideoBlob, compressVideoBlob } from "@/utils/video";
import { apiService } from "@/services/api";

const MAX_DURATION_MS = 30000;

const formatDuration = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
const formatSize = (bytes: number) => {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
};

export default function RecordPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedBlob, setSelectedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "compressing" | "uploading" | "success">("idle");
  const [userId, setUserId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      router.push("/login");
      return;
    }
    setUserId(id);

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [router, previewUrl]);

  const openFilePicker = () => fileInputRef.current?.click();

  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedBlob(null);
    setPreviewUrl(null);
    setSelectedFileName(null);
    setDurationMs(0);
    setUploadProgress(0);
    setUploadStatus("idle");
  };

  const extractDuration = (url: string) =>
    new Promise<number>((resolve, reject) => {
      const probe = document.createElement("video");
      probe.preload = "metadata";
      probe.src = url;
      probe.onloadedmetadata = () => {
        const ms = probe.duration * 1000;
        if (!Number.isFinite(ms) || ms <= 0) {
          reject(new Error("Unable to read video length."));
          return;
        }
        if (ms > MAX_DURATION_MS) {
          reject(new Error("Clip must be 30 seconds or shorter."));
          return;
        }
        resolve(ms);
      };
      probe.onerror = () => reject(new Error("Unable to load video metadata."));
    });

  const processFile = async (file: File) => {
    if (!file.type.startsWith("video")) {
      throw new Error("Please choose a video file.");
    }

    const tempUrl = URL.createObjectURL(file);
    try {
      const ms = await extractDuration(tempUrl);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedBlob(file);
      setPreviewUrl(tempUrl);
      setSelectedFileName(file.name);
      setDurationMs(ms);
      setError(null);
    } catch (err) {
      URL.revokeObjectURL(tempUrl);
      throw err;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await processFile(file);
      } catch (err: any) {
        setError(err?.message || "Invalid video file.");
        clearSelection();
      }
    }
    event.target.value = "";
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    try {
      await processFile(file);
    } catch (err: any) {
      setError(err?.message || "Invalid video file.");
      clearSelection();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!selectedBlob || !userId) {
      setError("Please select a verified clip first.");
      return;
    }

    let progressInterval: number | undefined;

    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);
      setUploadStatus("compressing");

      const validation = validateVideoBlob(selectedBlob);
      if (!validation.valid) {
        setError(validation.error || "Video does not meet requirements.");
        setUploadStatus("idle");
        return;
      }

      setUploadProgress(15);
      const compressedBlob = await compressVideoBlob(selectedBlob);
      setUploadProgress(40);

      setUploadStatus("uploading");
      setUploadProgress(55);
      progressInterval = window.setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + Math.random() * 15;
          return next >= 90 ? 90 : next;
        });
      }, 450);

      const response = await apiService.uploadVideo(compressedBlob, userId);
      if (progressInterval) {
        window.clearInterval(progressInterval);
      }
      setUploadProgress(100);
      setUploadStatus("success");

      if (response.processing_id) {
        localStorage.setItem("processingId", response.processing_id);
        setTimeout(() => {
          router.push("/processing");
        }, 1500);
      }
    } catch (err: any) {
      if (progressInterval) {
        window.clearInterval(progressInterval);
      }
      setError(err?.message || "Upload failed. Please retry.");
      setUploadStatus("idle");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#F7F9F4] dark:bg-gray-900 flex items-center justify-center px-4">
        <p className="text-[#344E41] dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  const dropZoneClasses = `rounded-2xl border-2 border-dashed transition-colors duration-200 p-6 sm:p-10 bg-white/80 dark:bg-gray-800/60 ${
    isDragging ? "border-[#3A7D44] bg-[#3A7D44]/5" : "border-[#A3B18A]/60"
  }`;

  return (
    <div className="min-h-screen bg-[#F7F9F4] dark:bg-gray-900 relative overflow-hidden px-4 py-6">
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute inset-0" style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(58,125,68,0.08), transparent 60%), radial-gradient(circle at 80% 0%, rgba(163,177,138,0.15), transparent 45%)"
        }} />
      </div>

      <div className="relative max-w-3xl mx-auto">
        <div className="absolute top-0 right-0">
          <ThemeToggle />
        </div>

        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm font-semibold text-[#3A7D44] dark:text-blue-300 hover:underline mb-6"
        >
          ← Back
        </button>

        <div className="space-y-2 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1F2A1C] dark:text-white">
            Upload your 30 second pitch
          </h1>
          <p className="text-sm sm:text-base text-[#4A5F43] dark:text-gray-300 max-w-2xl">
            Drop a short video that highlights your skills or story. We automatically optimize and compress it before submitting to the review team.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/40 bg-red-500/15 p-4 text-sm text-red-800 dark:text-red-200">
            <div className="flex items-center gap-2 font-semibold">
              <Icon name="warning-circle-svgrepo-com" size={18} color="#DC2626" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs font-semibold underline underline-offset-2"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="space-y-6">
          <section className="bg-white/80 dark:bg-gray-900/60 border border-[#A3B18A]/50 dark:border-gray-700 rounded-3xl shadow-lg shadow-[#3A7D44]/5 p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#D6E2C0] dark:border-gray-700 p-4 bg-[#F9FBF3] dark:bg-gray-800">
                <p className="text-xs uppercase tracking-wide text-[#567152] dark:text-gray-400 mb-3 font-semibold">Upload checklist</p>
                <ul className="space-y-2 text-sm text-[#2F3D2D] dark:text-gray-200">
                  <li>• Keep it under 30 seconds</li>
                  <li>• Use landscape orientation for best framing</li>
                  <li>• Stand near a quiet, well-lit space</li>
                  <li>• Introduce yourself and mention one highlight</li>
                </ul>
              </div>

              <div
                className={dropZoneClasses}
                onClick={openFilePicker}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {previewUrl ? (
                  <div className="space-y-3">
                    <div className="rounded-xl overflow-hidden aspect-video bg-black">
                      <video
                        src={previewUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-center text-[#294027] dark:text-gray-200">
                      {selectedFileName} · {formatDuration(durationMs)} · {formatSize(selectedBlob?.size ?? 0)}
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#E3EED4] dark:bg-gray-700">
                      <Icon name="upload-svgrepo-com" size={24} color="#3A7D44" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F2A1C] dark:text-white">Drag & drop your video</p>
                      <p className="text-sm text-[#4F6148] dark:text-gray-300">or click to browse local files</p>
                    </div>
                    <p className="text-xs text-[#6B7E66] dark:text-gray-400">
                      Accepted formats: MP4, MOV, WEBM — 200MB max
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#E1EBD2] dark:border-gray-700/80 bg-white/70 dark:bg-gray-800/60 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#6E8A68] dark:text-gray-400 font-semibold">Clip status</p>
                <p className="text-sm font-semibold text-[#1F2A1C] dark:text-white">
                  {selectedFileName ? "Ready for optimization" : "No clip selected yet"}
                </p>
                {selectedFileName ? (
                  <p className="text-xs text-[#4A5F43] dark:text-gray-300 mt-1">
                    {selectedFileName} · {formatDuration(durationMs)} · {formatSize(selectedBlob?.size ?? 0)}
                  </p>
                ) : (
                  <p className="text-xs text-[#4A5F43] dark:text-gray-300 mt-1">
                    Upload a clean take under 30 seconds.
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearSelection}
                  disabled={!selectedBlob || loading}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-[#D1DBC0] dark:border-gray-600 text-[#364831] dark:text-gray-200 disabled:opacity-40"
                >
                  Clear
                </button>
                <button
                  onClick={openFilePicker}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#3A7D44] text-white hover:bg-[#2C5A34] disabled:bg-[#3A7D44]/40"
                >
                  Browse files
                </button>
              </div>
            </div>
          </section>

          {selectedBlob && (
            <section className="bg-white/70 dark:bg-gray-900/60 border border-[#DDE8CF] dark:border-gray-700 rounded-3xl p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#6E8A68] dark:text-gray-400 font-semibold">Optimization</p>
                  <p className="text-sm text-[#1F2A1C] dark:text-white max-w-xl">
                    We validate the codec, trim background noise, and compress the file so reviewers can stream it immediately after upload.
                  </p>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={loading || uploadStatus === "success"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#3A7D44] to-[#2E5C35] hover:from-[#335F3A] hover:to-[#23472A] disabled:bg-slate-400"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Optimizing
                    </>
                  ) : (
                    <>
                      <Icon name="upload-svgrepo-com" size={18} color="white" />
                      Send clip
                    </>
                  )}
                </button>
              </div>

              {uploadStatus !== "idle" && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#4A5F43] dark:text-gray-300">
                    <span>
                      {uploadStatus === "compressing"
                        ? "Compressing and cleaning audio..."
                        : uploadStatus === "uploading"
                        ? "Uploading to Praxis..."
                        : "Upload complete"}
                    </span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E1EBD2] dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        uploadStatus === "success" ? "bg-green-500" : "bg-[#3A7D44]"
                      }`}
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
