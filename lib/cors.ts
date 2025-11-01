import { NextResponse } from "next/server";

// Allowed origins for CORS
const allowedOrigins = [
  "https://ai-quiz-generator-sp-seva-mela.netlify.app",
  "http://localhost:3001",
];

export function corsHeaders(origin: string | null) {
  // Check if the origin is in the allowed list
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : allowedOrigins[0],
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function handleCors(request: Request) {
  const origin = request.headers.get("origin");
  return corsHeaders(origin);
}

export function corsResponse(data: any, status: number, request: Request) {
  const headers = handleCors(request);
  return NextResponse.json(data, { status, headers });
}
