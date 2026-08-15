import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    // Intentionally not throwing at import time for optional-in-dev vars;
    // routes that truly need this should validate before use.
    return "";
  }
  return value;
}

export const env = {
  port: parseInt(required("PORT", "5000"), 10),
  nodeEnv: required("NODE_ENV", "development"),
  clientUrl: required("CLIENT_URL", "https://innovatutor.vercel.app"),

  mongodbUri: required("MONGODB_URI", ""),

  jwtSecret: required("JWT_SECRET", ""),
  jwtExpiresIn: required("JWT_EXPIRES_IN", "7d"),

  aiProvider: required("AI_PROVIDER", "free"),
  aiApiKey: required("AI_API_KEY", ""),
  aiModel: required("AI_MODEL", "gemini-3.5-flash-lite"),
};
