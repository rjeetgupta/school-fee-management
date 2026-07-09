import express, { Application } from "express";
import cors from "cors";
import apiRouter from "@routes/index";
import { errorHandler, notFoundHandler } from "@middlewares/errorHandler.middleware";

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "Server is healthy" });
  });

  app.use("/api/v1", apiRouter);

  // 404 handler for unmatched routes
  app.use(notFoundHandler);

  // Global error handler - must be LAST
  app.use(errorHandler);

  return app;
}
