import mongoose from "mongoose";
import { env } from "./env";

/**
 * Connects to MongoDB. Not called during Phase 1 (health-check only, no DB
 * dependency). Wire this into server.ts once Phase 2 (Authentication) begins
 * and MONGODB_URI is available in the environment.
 */
export async function connectDatabase(): Promise<void> {
  if (!env.mongodbUri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to backend/.env before connecting."
    );
  }
  await mongoose.connect(env.mongodbUri);
}
