import { NextRequest, NextResponse } from "next/server";
import {
  fetchLeaderboardData,
  addLeaderboardEntry,
  LeaderboardEntry,
} from "@/lib/google-sheets";

// GET: Fetch top 3 leaderboard entries
export async function GET() {
  try {
    const leaderboard = await fetchLeaderboardData();
    return NextResponse.json({ success: true, data: leaderboard });
  } catch (error) {
    console.error("Error in GET /api/leaderboard:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leaderboard data" },
      { status: 500 }
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
      return NextResponse.json(
        { success: false, error: "Invalid or missing name" },
        { status: 400 }
      );
    }

    if (score === undefined || typeof score !== "number" || score < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing score" },
        { status: 400 }
      );
    }

    const entry: LeaderboardEntry = {
      name: name.trim(),
      score,
      timestamp: new Date().toISOString(),
    };

    await addLeaderboardEntry(entry);

    return NextResponse.json({
      success: true,
      message: "Entry added successfully",
      data: entry,
    });
  } catch (error) {
    console.error("Error in POST /api/leaderboard:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add leaderboard entry" },
      { status: 500 }
    );
  }
}
