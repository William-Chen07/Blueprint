const WINDOW_MS = 60_000;
const MAX_REQUESTS = 15;

const buckets = new Map<string, { count: number; resetAt: number }>();

export function ratelimit(key: string): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: MAX_REQUESTS - 1, resetAt: now + WINDOW_MS };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count++;
  return { success: true, remaining: MAX_REQUESTS - bucket.count, resetAt: bucket.resetAt };
}

export function getClientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "anonymous";
}