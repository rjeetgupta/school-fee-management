export enum StudentStatus {
  ACTIVE = "Active",
}

export interface IStudent {
  admissionNumber: string;
  rollNumber: string;
  studentName: string;
  fatherName: string;
  class: string;
  mobileNumber: string;
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
  page?: number;
  limit?: number;
}
