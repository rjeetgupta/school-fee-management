import { Router } from "express";
import {
  createStudent,
  getStudentById,
  listStudents,
  updateStudent,
  deleteStudent,
} from "@controllers/student.controller";
import { validate } from "@middlewares/validate.middleware";
import { verifyJWT, requireRole } from "@middlewares/auth.middleware";
import {
  createStudentSchema,
  updateStudentSchema,
  getStudentByIdSchema,
  listStudentsQuerySchema,
} from "@validations/student.validation";

const router = Router();

router.use(verifyJWT, requireRole("admin"));

router
  .route("/")
  .post(validate(createStudentSchema), createStudent)
  .get(validate(listStudentsQuerySchema), listStudents);

router
  .route("/:id")
  .get(validate(getStudentByIdSchema), getStudentById)
  .patch(validate(updateStudentSchema), updateStudent)
  .delete(validate(getStudentByIdSchema), deleteStudent);

export default router;
