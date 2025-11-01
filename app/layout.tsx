import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leaderboard - Top 3 Players",
  description: "Real-time leaderboard showing top 3 players",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
