import { NextRequest, NextResponse } from "next/server";
import {
  fetchLeaderboardData,
  addLeaderboardEntry,
  LeaderboardEntry,
} from "@/lib/google-sheets";
import { corsResponse, handleCors } from "@/lib/cors";

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  const headers = handleCors(request);
  return NextResponse.json({}, { status: 200, headers });
}

// GET: Fetch top 3 leaderboard entries
export async function GET(request: NextRequest) {
  try {
    const leaderboard = await fetchLeaderboardData();
    return corsResponse({ success: true, data: leaderboard }, 200, request);
  } catch (error) {
    console.error("Error in GET /api/leaderboard:", error);
    return corsResponse(
      { success: false, error: "Failed to fetch leaderboard data" },
      500,
      request
    );
  }
}

// POST: Add new leaderboard entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, score } = body;

    // Validate input
    if (!name || typeof name !== "string" || name.trim() === "") {
      return corsResponse(
        { success: false, error: "Invalid or missing name" },
        400,
        request
      );
    }

    if (score === undefined || typeof score !== "number" || score < 0) {
      return corsResponse(
        { success: false, error: "Invalid or missing score" },
        400,
        request
      );
    }

    const entry: LeaderboardEntry = {
      name: name.trim(),
      score,
      timestamp: new Date().toISOString(),
    };

    await addLeaderboardEntry(entry);

    return corsResponse(
      {
        success: true,
        message: "Entry added successfully",
        data: entry,
      },
      200,
      request
    );
  } catch (error) {
    console.error("Error in POST /api/leaderboard:", error);
    return corsResponse(
      { success: false, error: "Failed to add leaderboard entry" },
      500,
      request
    );
  }
}
