import { Router } from "express";
import { studentLogin } from "@controllers/studentAuth.controller";
import { validate } from "@middlewares/validate.middleware";
import { studentLoginSchema } from "@validations/studentAuth.validation";

const router = Router();

router.post("/login", validate(studentLoginSchema), studentLogin);

export default router;
