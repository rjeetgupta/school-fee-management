import { Request, Response } from "express";
import { studentService } from "@services/student.service";
import { ApiResponse } from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { CreateStudentInput, UpdateStudentInput } from "@validations/student.validation";
import { StudentFilterQuery } from "@app-types/student.types";

/**
 * Controllers only: parse request → call the service → shape the response.
 * All business logic (uniqueness checks, due/total recalculation) lives in
 * student.service.ts.
 */

// POST /api/v1/students
export const createStudent = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as CreateStudentInput;
  const student = await studentService.createStudent(payload);
  res.status(201).json(new ApiResponse(201, student, "Student created successfully"));
});

// GET /api/v1/students/:id
export const getStudentById = asyncHandler(async (req: Request, res: Response) => {
  const student = await studentService.getStudentById(req.params.id);
  res.status(200).json(new ApiResponse(200, student, "Student fetched successfully"));
});

// GET /api/v1/students
export const listStudents = asyncHandler(async (req: Request, res: Response) => {
  const filters: StudentFilterQuery = {
    search: req.query.search as string | undefined,
    class: req.query.class as string | undefined,
    section: req.query.section as string | undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  };

  const result = await studentService.listStudents(filters);
  res.status(200).json(new ApiResponse(200, result, "Students fetched successfully"));
});

// PATCH /api/v1/students/:id
export const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as UpdateStudentInput;
  const updatedStudent = await studentService.updateStudent(req.params.id, payload);
  res.status(200).json(new ApiResponse(200, updatedStudent, "Student updated successfully"));
});

// DELETE /api/v1/students/:id
export const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await studentService.deleteStudent(req.params.id);
  res.status(200).json(new ApiResponse(200, deleted, "Student deleted successfully"));
});
