import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  store,
  mockAnalysis,
  mockSkills,
  mockJobs,
} from "../_store";
import { analyseWithGemini, matchJobsWithGemini, buildSkills } from "../_gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const userId = formData.get("user_id") as string | null;

    if (!image) return NextResponse.json({ detail: "Image file required" }, { status: 400 });
    if (!userId) return NextResponse.json({ detail: "User ID required" }, { status: 400 });

    const mimeType = image.type || "image/jpeg";
    if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
      return NextResponse.json(
        { detail: `Unsupported image type: ${mimeType}` },
        { status: 415 }
      );
    }

    const processingId = uuidv4();
    const bytes = Buffer.from(await image.arrayBuffer());

    store.processing[processingId] = {
      user_id: userId,
      status: "processing",
      media_type: "image",
      created_at: new Date().toISOString(),
    };

    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const { analysis, skillDetails } = await analyseWithGemini(bytes, mimeType, "image");
        const skills = buildSkills(skillDetails, analysis.detected_skills);
        const jobs = await matchJobsWithGemini(skills, analysis.summary);

        store.analysis[processingId] = analysis;
        store.skills[processingId] = skills;
        store.jobs[processingId] = jobs;
      } catch (e) {
        console.error("Gemini error:", e);
        store.analysis[processingId] = mockAnalysis("image");
        store.skills[processingId] = mockSkills();
        store.jobs[processingId] = mockJobs();
      }
    } else {
      store.analysis[processingId] = mockAnalysis("image");
      store.skills[processingId] = mockSkills();
      store.jobs[processingId] = mockJobs();
    }

    store.processing[processingId].status = "done";

    return NextResponse.json({
      processing_id: processingId,
      gemini_available: !!geminiKey,
      status: "done",
      analysis: store.analysis[processingId] ?? null,
      skills: store.skills[processingId] ?? [],
      jobs: store.jobs[processingId] ?? [],
    });
  } catch (err: any) {
    return NextResponse.json({ detail: err.message }, { status: 500 });
  }
}
