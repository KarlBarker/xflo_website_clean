// Simple in-memory rate limiter (consider Redis for production)
const submissionTracker = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 3; // Max 3 submissions per 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const record = submissionTracker.get(identifier);

  // Clean up old entries
  for (const [key, value] of submissionTracker.entries()) {
    if (now - value.timestamp > RATE_LIMIT_WINDOW) {
      submissionTracker.delete(key);
    }
  }

  if (!record) {
    submissionTracker.set(identifier, { count: 1, timestamp: now });
    return { allowed: true };
  }

  // Check if within window
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    submissionTracker.set(identifier, { count: 1, timestamp: now });
    return { allowed: true };
  }

  // Check count
  if (record.count >= MAX_SUBMISSIONS_PER_WINDOW) {
    const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - (now - record.timestamp)) / 60000);
    return {
      allowed: false,
      message: `Too many submissions. Please try again in ${remainingTime} minutes.`
    };
  }

  // Increment and allow
  record.count++;
  return { allowed: true };
}