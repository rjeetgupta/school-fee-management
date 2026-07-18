import express, { Application } from "express";
import cors from "cors";
import apiRouter from "@routes/index";
import { razorpayWebhook } from "@controllers/razorpay.controller";
import { errorHandler, notFoundHandler } from "@middlewares/errorHandler.middleware";

export function createApp(): Application {
  const app = express();

  app.use(cors());

  // Razorpay webhook signature verification needs the RAW request body, so
  // this must be mounted with express.raw() before the global express.json()
  // parser below — otherwise the body would already be parsed into an
  // object and the signature check would fail. Kept out of apiRouter
  // (which assumes JSON bodies) for this reason.
  app.post(
    "/api/v1/razorpay/webhook",
    express.raw({ type: "application/json" }),
    razorpayWebhook
  );

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
