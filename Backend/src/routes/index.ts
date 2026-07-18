import { Router } from "express";
import authRoutes from "@routes/auth.routes";
import studentAuthRoutes from "@routes/studentAuth.routes";
import studentRoutes from "@routes/student.routes";
import paymentRoutes from "@routes/payment.routes";
import feeMonthRoutes from "@routes/feeMonth.routes";
import razorpayRoutes from "@routes/razorpay.routes";
import studentPortalRoutes from "@routes/studentPortal.routes";
import dashboardRoutes from "@routes/dashboard.routes";
// import reportRoutes from "@routes/report.routes";       // Module 6

const router = Router();

router.use("/auth", authRoutes);
router.use("/student-auth", studentAuthRoutes);
router.use("/students", studentRoutes);
router.use("/payments", paymentRoutes);
router.use("/fee-months", feeMonthRoutes);
router.use("/razorpay", razorpayRoutes);
router.use("/student-portal", studentPortalRoutes);
router.use("/dashboard", dashboardRoutes);
// router.use("/reports", reportRoutes);

export default router;
