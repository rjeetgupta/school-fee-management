import { Router } from "express";
import studentRoutes from "@routes/student.routes";
import paymentRoutes from "@routes/payment.routes";
// import dashboardRoutes from "@routes/dashboard.routes"; // Module 5
// import reportRoutes from "@routes/report.routes";       // Module 6

const router = Router();

router.use("/students", studentRoutes);
router.use("/payments", paymentRoutes);
// router.use("/dashboard", dashboardRoutes);
// router.use("/reports", reportRoutes);

export default router;
