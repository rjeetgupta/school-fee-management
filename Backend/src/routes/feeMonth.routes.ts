import { Router } from "express";
import { generateMonthlyFee, getFeeHistory, getFeeSummary } from "@controllers/feeMonth.controller";
import { validate } from "@middlewares/validate.middleware";
import { verifyJWT, requireRole } from "@middlewares/auth.middleware";
import { studentIdParamSchema, generateMonthlyFeeSchema } from "@validations/feeMonth.validation";

const router = Router();

router.use(verifyJWT, requireRole("admin"));

router.post(
  "/student/:studentId/generate",
  validate(generateMonthlyFeeSchema),
  generateMonthlyFee
);
router.get("/student/:studentId/history", validate(studentIdParamSchema), getFeeHistory);
router.get("/student/:studentId/summary", validate(studentIdParamSchema), getFeeSummary);

export default router;
