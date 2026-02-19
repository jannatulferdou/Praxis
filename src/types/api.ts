// API Response Contracts - Strictly follow backend responses

export interface GeminiAnalysis {
  summary: string;
  detected_skills: string[];
  confidence_score: number;       // 0.0–1.0
  language_detected?: string;
  raw_transcript?: string;
  media_type: "video" | "image";
}

export interface ProcessingResponse {
  processing_id: string;
  gemini_available: boolean;
  status?: "done" | "failed";
  analysis?: GeminiAnalysis;
  skills?: Skill[];
  jobs?: Job[];
  error?: string;
}

export interface ProcessingStatusResponse {
  status: "processing" | "done" | "failed";
  analysis?: GeminiAnalysis;
  error?: string;
}

export interface Skill {
  name: string;
  level: 1 | 2 | 3;
  verified: boolean;
  confidence?: number;            // 0.0–1.0 from Gemini
}

export interface SkillsResponse {
  user: string;
  skills: Skill[];
  analysis?: GeminiAnalysis;
  error?: string;
}

export interface Job {
  title: string;
  match: number;  // 0-100
  salary?: string;
  reason?: string;
}

export interface JobsResponse {
  jobs: Job[];
  error?: string;
}

export interface User {
  id: string;
  phone: string;
  processing_id?: string;
}
