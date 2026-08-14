import rateLimit from "express-rate-limit";

/**
 * Auth endpoints (register/login) are the classic brute-force target —
 * tight limit per IP.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
    errorCode: "RATE_LIMITED",
  },
});

/**
 * Anything that triggers an AI provider call costs real money on paid
 * providers — a looser but still real ceiling per IP, per Section 26 of the
 * spec ("Rate Limiting and Security") and Section 38 ("Do Not Overuse AI").
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "You're sending messages too quickly. Please slow down.",
    errorCode: "RATE_LIMITED",
  },
});
