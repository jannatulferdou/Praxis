import { NextRequest, NextResponse } from "next/server";
import { store } from "../_store";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ detail: "id is required" }, { status: 400 });

  const record = store.processing[id];
  if (!record) return NextResponse.json({ detail: "Processing ID not found" }, { status: 404 });

  return NextResponse.json({
    status: record.status,
    analysis: store.analysis[id] ?? null,
  });
}
