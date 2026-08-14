import { createApp } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";

async function start(): Promise<void> {
  if (env.mongodbUri) {
    try {
      await connectDatabase();
      console.log("Connected to MongoDB.");
    } catch (err) {
      console.error(
        "Failed to connect to MongoDB. Falling back is NOT automatic here " +
          "(the in-memory repository is only selected when MONGODB_URI is " +
          "unset, not when it's set but unreachable). Fix MONGODB_URI and restart.",
        err
      );
      process.exit(1);
    }
  }
  // If MONGODB_URI is unset entirely, repositories/index.ts already selected
  // InMemoryUserRepository — nothing to connect.

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`AI English Tutor backend listening on port ${env.port}`);
    console.log(`Health check: http://localhost:${env.port}/api/v1/health`);
  });
}

start();
