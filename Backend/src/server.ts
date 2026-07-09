import { createApp } from "./app";
import { env } from "@config/env";
import { connectDatabase } from "@config/database";

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(env.port, () => {
    console.log(`[server] Running in ${env.nodeEnv} mode on port ${env.port}`);
  });

  const shutdown = (signal: string) => {
    console.log(`[server] ${signal} received. Shutting down gracefully...`);
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap().catch((error) => {
  console.error("[server] Failed to start:", error);
  process.exit(1);
});
