/**
 * Shared in-memory store for API routes.
 * In production replace with a database / Redis.
 */

export interface GeminiAnalysis {
  summary: string;
  detected_skills: string[];
  confidence_score: number;
  language_detected?: string;
  raw_transcript?: string;
  media_type: "video" | "image";
}

export interface SkillRecord {
  name: string;
  level: 1 | 2 | 3;
  verified: boolean;
  confidence?: number;
}

export interface JobRecord {
  title: string;
  match: number;
  salary?: string;
  reason?: string;
}

export interface ProcessingRecord {
  user_id: string;
  status: "processing" | "done" | "failed";
  media_type: "video" | "image";
  created_at: string;
}

// Global singleton stores (survive between requests in dev)
const g = globalThis as any;
if (!g.__praxisStore) {
  g.__praxisStore = {
    processing: {} as Record<string, ProcessingRecord>,
    analysis: {} as Record<string, GeminiAnalysis>,
    skills: {} as Record<string, SkillRecord[]>,
    jobs: {} as Record<string, JobRecord[]>,
  };
}

export const store: {
  processing: Record<string, ProcessingRecord>;
  analysis: Record<string, GeminiAnalysis>;
  skills: Record<string, SkillRecord[]>;
  jobs: Record<string, JobRecord[]>;
} = g.__praxisStore;

// ── Mock fallback data ────────────────────────────────────────────────────────

export function mockAnalysis(media_type: "video" | "image"): GeminiAnalysis {
  return {
    summary:
      "Mock analysis — add GEMINI_API_KEY to .env.local for real AI results.",
    detected_skills: ["ইট বসানো", "সিমেন্ট মিশ্রণ", "নির্মাণ তত্ত্বাবধান"],
    confidence_score: 0.8,
    language_detected: "Bangla",
    raw_transcript: undefined,
    media_type,
  };
}

export function mockSkills(): SkillRecord[] {
  return [
    { name: "ইট বসানো", level: 3, verified: true, confidence: 0.9 },
    { name: "সিমেন্ট মিশ্রণ", level: 2, verified: true, confidence: 0.8 },
    { name: "নির্মাণ তত্ত্বাবধান", level: 2, verified: true, confidence: 0.75 },
  ];
}

export function mockJobs(): JobRecord[] {
  return [
    {
      title: "সাইট ফোরম্যান",
      match: 85,
      salary: "৳25,000–30,000",
      reason: "ভিডিওতে সঠিক ইট বসানোর প্রমাণ",
    },
    {
      title: "নির্মাণ কর্মচারী",
      match: 72,
      salary: "৳18,000–22,000",
      reason: "সিমেন্ট মিশ্রণ দক্ষতা প্রদর্শিত",
    },
    {
      title: "প্রকল্প ব্যবস্থাপক",
      match: 65,
      salary: "৳35,000–45,000",
      reason: "তত্ত্বাবধান অভিজ্ঞতা",
    },
  ];
}
