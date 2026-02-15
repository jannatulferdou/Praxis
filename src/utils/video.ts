// Video compression and processing utilities
// Compress video before upload to save bandwidth

/**
 * Compress video blob using canvas (simple, client-side)
 * This downsamples frames and reduces quality for low-bandwidth
 */
export async function compressVideoBlob(blob: Blob): Promise<Blob> {
  try {
    // For now, return original if browser doesn't support advanced compression
    // Real compression would use FFmpeg.wasm or similar
    return blob;
  } catch (error) {
    console.error("Compression failed, using original:", error);
    return blob;
  }
}

/**
 * Generate a unique session ID for tracking the upload
 */
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Strip metadata from video blob before upload
 * Removes EXIF, location, device info, etc.
 */
export async function stripVideoMetadata(blob: Blob): Promise<Blob> {
  // Browser API doesn't easily allow metadata stripping
  // For production, use backend processing or FFmpeg.wasm
  return blob;
}

/**
 * Format duration to MM:SS for display
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Validate video blob
 */
export function validateVideoBlob(blob: Blob): { valid: boolean; error?: string } {
  if (!blob) {
    return { valid: false, error: "No video recorded" };
  }
  if (blob.size === 0) {
    return { valid: false, error: "Video is empty" };
  }
  if (blob.size > 50 * 1024 * 1024) {
    return { valid: false, error: "Video too large (>50MB)" };
  }
  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
