import { z } from "zod";

export const studentLoginFormSchema = z.object({
  studentId: z.string().trim().min(1, "Student ID is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export type StudentLoginFormValues = z.infer<typeof studentLoginFormSchema>;

export const studentLoginFormDefaults: StudentLoginFormValues = {
  studentId: "",
  dateOfBirth: "",
};
