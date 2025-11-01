"use client";

import { useEffect, useState } from "react";

interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp?: string;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
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
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900";
      case 2:
        return "bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100";
      default:
        return "bg-gray-200 text-gray-900";
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">🏆 Leaderboard</h1>
          <p className="text-purple-100 text-sm">Top 3 Players</p>
          {lastUpdated && (
            <p className="text-purple-200 text-xs mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Leaderboard Entries */}
        <div className="p-6 space-y-4">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No entries yet</p>
              <p className="text-sm mt-2">Be the first to score!</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={`${entry.name}-${index}`}
                className={`${getMedalColor(
                  index
                )} rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
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

        {/* Auto-refresh indicator */}
        <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-600 border-t">
          <p>🔄 Auto-refreshes every minute</p>
        </div>
      </div>
    </div>
  );
}
