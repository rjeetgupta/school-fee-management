import { Router } from "express";
import { login } from "@controllers/auth.controller";
import { validate } from "@middlewares/validate.middleware";
import { loginSchema } from "@validations/auth.validation";

const router = Router();
router.route("/login").post(validate(loginSchema), login)

export default router;