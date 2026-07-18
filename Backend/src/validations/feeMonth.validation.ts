import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const monthKeyRegex = /^\d{4}-\d{2}$/;

export const studentIdParamSchema = z.object({
  params: z.object({
    studentId: z.string().regex(objectIdRegex, "Invalid student id"),
  }),
});

export const generateMonthlyFeeSchema = z.object({
  params: z.object({
    studentId: z.string().regex(objectIdRegex, "Invalid student id"),
  }),
  body: z.object({
    month: z.string().regex(monthKeyRegex, "Month must be in YYYY-MM format").optional(),
  }),
});
