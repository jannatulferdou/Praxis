import { NextRequest, NextResponse } from "next/server";
import { store } from "../_store";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ detail: "id is required" }, { status: 400 });

  const skills = store.skills[id];
  if (!skills) return NextResponse.json({ detail: "Skills not found for this ID" }, { status: 404 });

  return NextResponse.json({
    user: "Guest User",
    skills,
    analysis: store.analysis[id] ?? null,
  });
}
