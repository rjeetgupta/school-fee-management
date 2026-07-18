export interface StudentLoginInput {
  studentId: string;
  dateOfBirth: Date | string;
}

export interface StudentLoginResult {
  token: string;
  student: {
    id: string;
    admissionNumber: string;
    studentName: string;
    class: string;
  };
}
