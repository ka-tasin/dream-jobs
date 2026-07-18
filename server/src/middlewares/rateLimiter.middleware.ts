import rateLimit from "express-rate-limit";


export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  message: {
    success: false,
    message: "Too many login attempts from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});


export const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10,
  message: {
    success: false,
    message: "You have exceeded the maximum job applications limit for this hour. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});