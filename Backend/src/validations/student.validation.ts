import { z } from "zod";

const mobileRegex = /^[6-9]\d{9}$/; // adjust per target country format

export const createStudentSchema = z.object({
  body: z.object({
    admissionNumber: z.string().trim().min(1, "Admission number is required"),
    rollNumber: z.string().trim().min(1, "Roll number is required"),
    studentName: z.string().trim().min(2, "Student name is required"),
    fatherName: z.string().trim().min(2, "Father name is required"),
    class: z.string().trim().min(1, "Class is required"),
    address: z.string().trim().optional(),
    mobileNumber: z
      .string()
      .trim()
      .regex(mobileRegex, "Enter a valid 10-digit mobile number"),
    whatsappNumber: z
      .string()
      .trim()
      .regex(mobileRegex, "Enter a valid 10-digit WhatsApp number")
      .optional(),
    tuitionFee: z.number({ invalid_type_error: "Tuition fee must be a number" }).nonnegative(),
    hostelFee: z.number().nonnegative().optional(),
    miscellaneousFee: z.number().nonnegative().optional(),
  }),
});

export const updateStudentSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Student id is required"),
  }),
  body: createStudentSchema.shape.body.partial(),
});

export const getStudentByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Student id is required"),
  }),
});

export const listStudentsQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    class: z.string().trim().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>["body"];
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>["body"];
