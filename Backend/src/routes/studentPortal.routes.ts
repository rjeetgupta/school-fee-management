import { Router } from "express";
import {
  getMyProfile,
  getMyFeeSummary,
  getMyFeeHistory,
  getMyPayments,
} from "@controllers/studentPortal.controller";
import { verifyJWT, requireRole } from "@middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT, requireRole("student"));

router.get("/me", getMyProfile);
router.get("/fee-summary", getMyFeeSummary);
router.get("/fee-history", getMyFeeHistory);
router.get("/payments", getMyPayments);

export default router;
