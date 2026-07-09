import mongoose from "mongoose";
import { env } from "@config/env";

export async function connectDatabase(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.mongoUri);
    console.log("[database] MongoDB connected successfully");
  } catch (error) {
    console.error("[database] MongoDB connection failed:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log("[database] MongoDB disconnected");
}
