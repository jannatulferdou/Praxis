import { NextRequest, NextResponse } from "next/server";
import { store } from "../_store";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ detail: "id is required" }, { status: 400 });

  const jobs = store.jobs[id];
  if (!jobs) return NextResponse.json({ detail: "Jobs not found for this ID" }, { status: 404 });

  return NextResponse.json({ jobs });
}
