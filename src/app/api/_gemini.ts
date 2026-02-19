import { GeminiAnalysis, JobRecord, SkillRecord } from "./_store";

const SKILL_EXTRACTION_PROMPT = `
You are an expert workforce analyst. Analyse the provided media (video or image) and:

1. Identify every professional, technical, or vocational skill demonstrated or mentioned.
2. Rate each skill 1–3 (1=basic, 2=intermediate, 3=expert) based on evidence.
3. Assign a confidence score (0.0–1.0) to each skill.
4. Detect the primary language (Bangla, English, or mixed).
5. Provide a concise summary (2–3 sentences) of what is demonstrated.
6. If video, briefly transcribe spoken content.

Respond ONLY with valid JSON — no markdown, no extra text:
{
  "summary": "...",
  "detected_skills": ["skill1", "skill2"],
  "skill_details": [
    {"name": "skill1", "level": 2, "confidence": 0.9}
  ],
  "confidence_score": 0.85,
  "language_detected": "Bangla",
  "raw_transcript": "..."
}
`;

const JOB_MATCHING_PROMPT = (skills: string, summary: string) => `
You are a recruiter matching a candidate to Bangladesh job market opportunities.
Verified skills: ${skills}
Summary: ${summary}

Suggest exactly 3 realistic job matches. Respond ONLY with valid JSON:
{
  "jobs": [
    {"title": "...", "match_score": 85, "salary_range": "৳25,000–30,000", "reason": "..."}
  ]
}
`;

function safeJson(text: string): any {
  const cleaned = text.trim().replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(cleaned);
}

export async function analyseWithGemini(
  fileBytes: Buffer,
  mimeType: string,
  mediaType: "video" | "image"
): Promise<{ analysis: GeminiAnalysis; skillDetails: any[] }> {
  // Dynamic import — package may not be installed yet, fail gracefully
  const { GoogleGenerativeAI } = await import("@google/generative-ai");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env.local");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const base64 = fileBytes.toString("base64");

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64,
        mimeType,
      },
    },
    SKILL_EXTRACTION_PROMPT,
  ]);

  const data = safeJson(result.response.text());

  const analysis: GeminiAnalysis = {
    summary: data.summary ?? "",
    detected_skills: data.detected_skills ?? [],
    confidence_score: parseFloat(data.confidence_score ?? 0.7),
    language_detected: data.language_detected,
    raw_transcript: data.raw_transcript,
    media_type: mediaType,
  };

  return { analysis, skillDetails: data.skill_details ?? [] };
}

export async function matchJobsWithGemini(
  skills: SkillRecord[],
  summary: string
): Promise<JobRecord[]> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return [];

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const skillNames = skills.map((s) => s.name).join(", ");
  const result = await model.generateContent(JOB_MATCHING_PROMPT(skillNames, summary));
  const data = safeJson(result.response.text());

  return (data.jobs ?? []).map((j: any) => ({
    title: j.title ?? "",
    match: parseInt(j.match_score ?? 70),
    salary: j.salary_range,
    reason: j.reason,
  }));
}

export function buildSkills(skillDetails: any[], detectedSkills: string[]): SkillRecord[] {
  if (skillDetails.length > 0) {
    return skillDetails.map((s) => ({
      name: s.name ?? "Unknown",
      level: (Math.max(1, Math.min(3, parseInt(s.level ?? 2))) as 1 | 2 | 3),
      verified: true,
      confidence: parseFloat(s.confidence ?? 0.8),
    }));
  }
  return detectedSkills.map((name) => ({
    name,
    level: 2 as const,
    verified: true,
    confidence: 0.75,
  }));
}
