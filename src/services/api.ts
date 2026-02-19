// API service layer
// Single source of truth for all backend communication

import {
  ProcessingResponse,
  ProcessingStatusResponse,
  SkillsResponse,
  JobsResponse,
} from "@/types/api";

/** Safely extract an error message from any HTTP response (JSON or plain text). */
async function extractError(res: Response, fallback: string): Promise<string> {
  try {
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      const body = await res.json();
      return body.detail || body.message || body.error || fallback;
    }
    const text = (await res.text()).trim();
    return text.slice(0, 300) || fallback;
  } catch {
    return fallback;
  }
}

class ApiService {
  /**
   * Upload video to backend → Gemini extracts skills + transcript
   * POST /upload-video with multipart/form-data
   */
  async uploadVideo(videoBlob: Blob, userId: string): Promise<ProcessingResponse> {
    try {
      const formData = new FormData();
      formData.append("video", videoBlob, "video.webm");
      formData.append("user_id", userId);

      const response = await fetch(`/api/upload-video`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await extractError(response, "Upload failed"));
      }

      return await response.json();
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

  /**
   * Upload an image (certificate, work photo) → Gemini analyses visible skills
   * POST /upload-image with multipart/form-data
   */
  async uploadImage(imageFile: File, userId: string): Promise<ProcessingResponse> {
    try {
      const formData = new FormData();
      formData.append("image", imageFile, imageFile.name);
      formData.append("user_id", userId);

      const response = await fetch(`/api/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await extractError(response, "Image upload failed"));
      }

      return await response.json();
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  }

  /**
   * Poll processing status (includes Gemini analysis once done)
   * GET /processing-status?id=xxx
   */
  async getProcessingStatus(processingId: string): Promise<ProcessingStatusResponse> {
    try {
      const response = await fetch(
        `/api/processing-status?id=${processingId}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(await extractError(response, "Status check failed"));
      }

      return await response.json();
    } catch (error) {
      console.error("Status check error:", error);
      throw error;
    }
  }

  /**
   * Get verified skills (includes Gemini analysis summary)
   * GET /skills?id=xxx
   */
  async getSkills(processingId: string): Promise<SkillsResponse> {
    try {
      const response = await fetch(`/api/skills?id=${processingId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(await extractError(response, "Skills fetch failed"));
      }

      return await response.json();
    } catch (error) {
      console.error("Skills fetch error:", error);
      throw error;
    }
  }

  /**
   * Get matched jobs
   * GET /jobs?id=xxx
   */
  async getJobs(processingId: string): Promise<JobsResponse> {
    try {
      const response = await fetch(`/api/jobs?id=${processingId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(await extractError(response, "Jobs fetch failed"));
      }

      return await response.json();
    } catch (error) {
      console.error("Jobs fetch error:", error);
      throw error;
    }
  }

  /**
   * Health check – also reports whether Gemini is configured
   */
  async healthCheck(): Promise<{ ok: boolean; gemini_configured?: boolean }> {
    try {
      const response = await fetch(`/api/health`, { method: "GET" });
      if (!response.ok) return { ok: false };
      const data = await response.json();
      return { ok: true, gemini_configured: data.gemini_configured };
    } catch {
      return { ok: false };
    }
  }
}

export const apiService = new ApiService();
