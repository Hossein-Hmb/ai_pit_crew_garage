import { NextRequest, NextResponse } from "next/server";

// Optional: Upstash rate limiting if env vars are present
let upstashReady =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;
let ratelimit: any = null;
if (upstashReady) {
  try {
    // Lazy require to avoid dev errors if not installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Ratelimit } = require("@upstash/ratelimit");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Redis } = require("@upstash/redis");
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    const limit = Number(process.env.RATE_LIMIT_MAX_PER_MINUTE || 30);
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(limit, "60 s"),
      analytics: true,
    });
  } catch {
    upstashReady = false;
  }
}

// Dev fallback: best-effort in-memory limiter per edge instance
const devCounters: Map<string, { count: number; reset: number }> = new Map();
const devLimit = Number(process.env.RATE_LIMIT_MAX_PER_MINUTE || 30);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const protect =
    req.method === "POST" &&
    (pathname.startsWith("/api/generate/") ||
      pathname.startsWith("/api/garage-items"));
  if (!protect) return NextResponse.next();

  const ip =
    req.ip ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anonymous";

  if (upstashReady && ratelimit) {
    const { success, remaining, limit, reset } = await ratelimit.limit(ip);
    if (!success) {
      return new NextResponse(JSON.stringify({ error: "rate_limited" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
        },
      });
    }
    const res = NextResponse.next();
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    return res;
  }

  // Dev fallback
  const now = Date.now();
  const slot = Math.floor(now / 60000); // 1-minute window
  const key = `${ip}:${slot}`;
  const entry = devCounters.get(key) || {
    count: 0,
    reset: slot * 60000 + 60000,
  };
  entry.count += 1;
  devCounters.set(key, entry);
  if (entry.count > devLimit) {
    return new NextResponse(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
