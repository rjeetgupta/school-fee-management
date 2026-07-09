export const STUDENT_STATUS = {
  ACTIVE: "Active",
} as const;

export interface Student {
  _id: string;
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
  totalFee?: number;
  dueFee?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StudentListFilters {
  search?: string;
  class?: string;
  page?: number;
  limit?: number;
}
