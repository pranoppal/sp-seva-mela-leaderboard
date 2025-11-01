import { NextRequest, NextResponse } from "next/server";
import { initializeSpreadsheet } from "@/lib/google-sheets";
import { corsResponse, handleCors } from "@/lib/cors";

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  const headers = handleCors(request);
  return NextResponse.json({}, { status: 200, headers });
}

// GET: Initialize spreadsheet with headers
export async function GET(request: NextRequest) {
  try {
    await initializeSpreadsheet();
    return corsResponse(
      {
        success: true,
        message: "Spreadsheet initialized successfully",
      },
      200,
      request
    );
  } catch (error) {
    console.error("Error in GET /api/initialize:", error);
    return corsResponse(
      { success: false, error: "Failed to initialize spreadsheet" },
      500,
      request
    );
  }
}
