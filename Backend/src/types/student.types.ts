export enum StudentStatus {
  ACTIVE = "Active",
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export interface IStudent {
  admissionNumber: string;
  rollNumber: string;
  studentName: string;
  fatherName: string;
  class: string;
  section: string;
  email: string;
  gender: Gender;
  mobileNumber: string;
  dateOfBirth: Date;
  whatsappNumber?: string;
  tuitionFee: number;
  hostelFee?: number;
  miscellaneousFee?: number;
  address?: string;
  /** Denormalized sum of tuitionFee + hostelFee + miscellaneousFee. Kept in sync by student.service.ts. */
  totalFee?: number;
  /** Denormalized totalFee - totalPayments. Kept in sync by student.service.ts / payment.service.ts. */
  dueFee?: number;
  status: StudentStatus;
}

export interface StudentFilterQuery {
  search?: string;
  class?: string;
  section?: string;
  page?: number;
  limit?: number;
}
