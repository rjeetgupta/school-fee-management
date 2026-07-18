import { studentRepository } from "@repositories/student.repository";
import { signToken } from "@utils/jwt";
import { ApiError } from "@utils/ApiError";
import { StudentLoginInput, StudentLoginResult } from "@app-types/studentAuth.types";

function toDateOnlyString(date: Date): string {
  return date.toISOString().split("T")[0];
}

class StudentAuthService {
  /**
   * Identity is verified with two pieces of information only: the student's
   * Student ID (their admission number) and their Date of Birth — no
   * separate password is stored. Both are checked before returning a
   * generic error, so a wrong Student ID and a wrong DOB look identical to
   * the caller.
   */
  async login({ studentId, dateOfBirth }: StudentLoginInput): Promise<StudentLoginResult> {
    const student = await studentRepository.findByAdmissionNumber(studentId);

    if (!student) {
      throw ApiError.unauthorized("Invalid Student ID or Date of Birth");
    }

    const providedDob = toDateOnlyString(new Date(dateOfBirth));
    const storedDob = toDateOnlyString(student.dateOfBirth);

    if (providedDob !== storedDob) {
      throw ApiError.unauthorized("Invalid Student ID or Date of Birth");
    }

    const token = signToken({
      id: student._id.toString(),
      admissionNumber: student.admissionNumber,
      role: "student",
    });

    return {
      token,
      student: {
        id: student._id.toString(),
        admissionNumber: student.admissionNumber,
        studentName: student.studentName,
        class: student.class,
      },
    };
  }
}

export const studentAuthService = new StudentAuthService();
