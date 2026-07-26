// In-memory rate limiter. Fine for a single-instance server only.
// For serverless/multi-instance production, replace with a shared store such as Redis/Upstash.
const attempts = new Map();
let callCount = 0;

function cleanup() {
  const now = Date.now();
  for (const [key, record] of attempts.entries()) {
    if (now > record.resetAt) attempts.delete(key);
  }
}

export function rateLimit(key, { max = 5, windowMs = 15 * 60 * 1000 } = {}) {
  callCount += 1;
  if (callCount % 100 === 0) cleanup(); // periodic sweep, keeps memory bounded

  const now = Date.now();
  const record = attempts.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  record.count += 1;
  attempts.set(key, record);

  return {
    allowed: record.count <= max,
    remaining: Math.max(0, max - record.count),
    resetAt: record.resetAt,
  };
}
