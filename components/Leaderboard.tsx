"use client";

import { useEffect, useState } from "react";

interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp?: string;
}

// Mock data for testing
const mockLeaderboardData: LeaderboardEntry[] = [
  { name: "Rajesh Kumar", score: 2850, timestamp: "2025-11-06T10:30:00Z" },
  { name: "Priya Sharma", score: 2720, timestamp: "2025-11-06T10:25:00Z" },
  { name: "Amit Patel", score: 2680, timestamp: "2025-11-06T10:20:00Z" },
  { name: "Sneha Reddy", score: 2540, timestamp: "2025-11-06T10:15:00Z" },
  { name: "Vikram Singh", score: 2420, timestamp: "2025-11-06T10:10:00Z" },
  { name: "Anjali Desai", score: 2310, timestamp: "2025-11-06T10:05:00Z" },
  { name: "Rohit Mehta", score: 2180, timestamp: "2025-11-06T10:00:00Z" },
  { name: "Kavita Iyer", score: 2050, timestamp: "2025-11-06T09:55:00Z" },
  { name: "Arjun Nair", score: 1920, timestamp: "2025-11-06T09:50:00Z" },
  { name: "Pooja Gupta", score: 1780, timestamp: "2025-11-06T09:45:00Z" },
];

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setError(null);
      const response = await fetch("/api/leaderboard");
      const data = await response.json();

      if (data.success) {
        setLeaderboard(data.data);
        setLastUpdated(new Date());
      } else {
        setError(data.error || "Failed to fetch leaderboard");
      }
    } catch (err) {
      setError("Network error: Unable to fetch leaderboard");
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLeaderboard();

    // Set up interval to fetch every minute (60000ms)
    const interval = setInterval(fetchLeaderboard, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const getMedalColor = (position: number) => {
    switch (position) {
      case 0:
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900";
      case 1:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900";
      case 2:
        return "bg-gradient-to-r from-amber-600 to-amber-700 text-gray-900";
      default:
        return "bg-gray-700 text-gray-100";
    }
  };

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div
        className="rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
        style={{ backgroundColor: "rgb(98 105 119)" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-11 text-center">
          <h1 className="text-7xl font-bold mb-2">Seva Mela 2025</h1>
          <h1 className="text-5xl font-bold mb-2">🏆 Leaderboard</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4 m-4"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Leaderboard Entries */}
        <div className="p-6 space-y-4">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl">No entries yet</p>
              <p className="text-sm mt-2">Be the first to score!</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={`${entry.name}-${index}`}
                className={`${getMedalColor(
                  index
                )} rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-5xl">{getMedalEmoji(index)}</span>
                    <div>
                      <p className="text-2xl font-bold">{entry.name}</p>
                      <p className="text-sm opacity-75">Rank #{index + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold">{entry.score}</p>
                    <p className="text-sm opacity-75">points</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
