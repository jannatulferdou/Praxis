import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Praxis API (Next.js) is running",
    gemini_configured: !!process.env.GEMINI_API_KEY,
    gemini_model: "gemini-2.0-flash",
  });
}
