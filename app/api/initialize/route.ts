import { NextResponse } from "next/server";
import { initializeSpreadsheet } from "@/lib/google-sheets";

// GET: Initialize spreadsheet with headers
export async function GET() {
  try {
    await initializeSpreadsheet();
    return NextResponse.json({
      success: true,
      message: "Spreadsheet initialized successfully",
    });
  } catch (error) {
    console.error("Error in GET /api/initialize:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize spreadsheet" },
      { status: 500 }
    );
  }
}
