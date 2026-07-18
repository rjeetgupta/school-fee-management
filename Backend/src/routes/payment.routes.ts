import { Router } from "express";
import {
  depositFee,
  updateDeposit,
  deleteDeposit,
  getPaymentsByStudent,
} from "@controllers/payment.controller";
import { validate } from "@middlewares/validate.middleware";
import { verifyJWT, requireRole } from "@middlewares/auth.middleware";
import {
  depositFeeSchema,
  updateDepositSchema,
  paymentIdParamSchema,
  studentIdParamSchema,
} from "@validations/payment.validation";

const router = Router();

router.use(verifyJWT, requireRole("admin"));

router.post("/", validate(depositFeeSchema), depositFee);
router.get("/student/:studentId", validate(studentIdParamSchema), getPaymentsByStudent);

router
  .route("/:id")
  .patch(validate(updateDepositSchema), updateDeposit)
  .delete(validate(paymentIdParamSchema), deleteDeposit);

export default router;
