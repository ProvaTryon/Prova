import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // دقيقة
  max: 100, // 100 request في الدقيقة
  message: { msg: "Too many requests, slow down." },
});
