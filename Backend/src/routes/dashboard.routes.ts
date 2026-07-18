import { Router } from "express";
import { getDashboardSummary } from "@controllers/dashboard.controller";
import { verifyJWT, requireRole } from "@middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT, requireRole("admin"));

router.get("/summary", getDashboardSummary);

export default router;
