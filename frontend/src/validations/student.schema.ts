import { z } from "zod";

const mobileRegex = /^[6-9]\d{9}$/;

export const studentFormSchema = z.object({
  admissionNumber: z.string().trim().min(1, "Admission number is required"),
  rollNumber: z.string().trim().min(1, "Roll number is required"),
  studentName: z.string().trim().min(2, "Student name is required"),
  fatherName: z.string().trim().min(2, "Father's name is required"),
  class: z.string().trim().min(1, "Class is required"),
  mobileNumber: z
    .string()
    .trim()
    .regex(mobileRegex, "Enter a valid 10-digit mobile number"),
  whatsappNumber: z
    .string()
    .trim()
    .regex(mobileRegex, "Enter a valid 10-digit WhatsApp number")
    .optional()
    .or(z.literal("")),
  tuitionFee: z.coerce
    .number({ error: "Tuition fee must be a number" })
    .nonnegative("Tuition fee cannot be negative"),
  hostelFee: z.coerce.number().nonnegative().optional(),
  miscellaneousFee: z.coerce.number().nonnegative().optional(),
});

export type StudentFormValues = z.input<typeof studentFormSchema>;
export type StudentFormOutput = z.output<typeof studentFormSchema>;

export const studentFormDefaults: StudentFormValues = {
  admissionNumber: "",
  rollNumber: "",
  studentName: "",
  fatherName: "",
  class: "",
  mobileNumber: "",
  whatsappNumber: "",
  tuitionFee: 0,
  hostelFee: 0,
  miscellaneousFee: 0,
};
