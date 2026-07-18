import { Router } from "express";
import { createOrder, verifyPayment, markPaymentFailed } from "@controllers/razorpay.controller";
import { validate } from "@middlewares/validate.middleware";
import { verifyJWT, requireRole } from "@middlewares/auth.middleware";
import {
  createOrderSchema,
  verifyPaymentSchema,
  markPaymentFailedSchema,
} from "@validations/razorpay.validation";

const router = Router();

router.use(verifyJWT, requireRole("student"));

router.post("/order", validate(createOrderSchema), createOrder);
router.post("/verify", validate(verifyPaymentSchema), verifyPayment);
router.post("/failure", validate(markPaymentFailedSchema), markPaymentFailed);

export default router;
