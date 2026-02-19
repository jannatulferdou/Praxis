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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const video = formData.get("video") as File | null;
    const userId = formData.get("user_id") as string | null;

    if (!video) return NextResponse.json({ detail: "Video file required" }, { status: 400 });
    if (!userId) return NextResponse.json({ detail: "User ID required" }, { status: 400 });

    const processingId = uuidv4();
    const mimeType = video.type || "video/mp4";
    const bytes = Buffer.from(await video.arrayBuffer());

    store.processing[processingId] = {
      user_id: userId,
      status: "processing",
      media_type: "video",
      created_at: new Date().toISOString(),
    };

    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const { analysis, skillDetails } = await analyseWithGemini(bytes, mimeType, "video");
        const skills = buildSkills(skillDetails, analysis.detected_skills);
        const jobs = await matchJobsWithGemini(skills, analysis.summary);

        store.analysis[processingId] = analysis;
        store.skills[processingId] = skills;
        store.jobs[processingId] = jobs;
      } catch (e) {
        console.error("Gemini error:", e);
        store.analysis[processingId] = mockAnalysis("video");
        store.skills[processingId] = mockSkills();
        store.jobs[processingId] = mockJobs();
      }
    } else {
      store.analysis[processingId] = mockAnalysis("video");
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
