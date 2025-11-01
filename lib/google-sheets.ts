import { google } from "googleapis";

export interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp?: string;
}

// Initialize Google Sheets API
export async function getGoogleSheetsClient() {
  const credentials = process.env.GOOGLE_CREDENTIALS;

  if (!credentials) {
    throw new Error("GOOGLE_CREDENTIALS environment variable is not set");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(credentials),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

// Fetch leaderboard data from Google Sheets
export async function fetchLeaderboardData(): Promise<LeaderboardEntry[]> {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID environment variable is not set");
    }

    const range = "Sheet1!A:C"; // Columns: Name, Score, Timestamp

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Skip header row and parse data
    const leaderboard: LeaderboardEntry[] = rows
      .slice(1)
      .map((row) => ({
        name: row[0] || "",
        score: parseInt(row[1] || "0", 10),
        timestamp: row[2] || "",
      }))
      .filter((entry) => entry.name && !isNaN(entry.score));

    // Sort by score descending and return top 3
    return leaderboard.sort((a, b) => b.score - a.score).slice(0, 3);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error;
  }
}

// Add new entry to Google Sheets
export async function addLeaderboardEntry(
  entry: LeaderboardEntry
): Promise<void> {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID environment variable is not set");
    }

    const timestamp = entry.timestamp || new Date().toISOString();
    const values = [[entry.name, entry.score, timestamp]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:C",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });
  } catch (error) {
    console.error("Error adding leaderboard entry:", error);
    throw error;
  }
}

// Initialize spreadsheet with headers if needed
export async function initializeSpreadsheet(): Promise<void> {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID environment variable is not set");
    }

    // Check if headers exist
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:C1",
    });

    if (!response.data.values || response.data.values.length === 0) {
      // Add headers
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Sheet1!A1:C1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [["Name", "Score", "Timestamp"]],
        },
      });
    }
  } catch (error) {
    console.error("Error initializing spreadsheet:", error);
    throw error;
  }
}
