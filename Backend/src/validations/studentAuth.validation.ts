import { z } from "zod";

export const studentLoginSchema = z.object({
  body: z.object({
    studentId: z.string().trim().min(1, "Student ID is required"),
    dateOfBirth: z.coerce.date({ invalid_type_error: "Enter a valid date of birth" }),
  }),
});

export type StudentLoginBody = z.infer<typeof studentLoginSchema>["body"];
