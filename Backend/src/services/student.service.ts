import { studentRepository } from "@repositories/student.repository";
import { paymentRepository } from "@repositories/payment.repository";
import { StudentDocument } from "@models/student.model";
import { ApiError } from "@utils/ApiError";
import { CreateStudentInput, UpdateStudentInput } from "@validations/student.validation";
import { StudentFilterQuery } from "@app-types/student.types";
import { PaginatedResult } from "@app-types/common.types";

class StudentService {
  async createStudent(payload: CreateStudentInput): Promise<StudentDocument> {
    const existingAdmission = await studentRepository.findByAdmissionNumber(
      payload.admissionNumber
    );
    if (existingAdmission) {
      throw ApiError.conflict("Admission number already exists"); // Business Rule 1
    }

    const rollTaken = await studentRepository.existsByRollNumberInClass(
      payload.rollNumber,
      payload.class,
      payload.section
    );
    if (rollTaken) {
      throw ApiError.conflict("Roll number already exists in this class and section"); // Business Rule 2
    }

    // totalFee/dueFee are populated by the schema's default functions on creation.
    return studentRepository.create(payload);
  }

  async getStudentById(id: string): Promise<StudentDocument> {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw ApiError.notFound("Student not found");
    }
    return student;
  }

  async listStudents(filters: StudentFilterQuery): Promise<PaginatedResult<StudentDocument>> {
    return studentRepository.findAll(filters);
  }

  async updateStudent(id: string, payload: UpdateStudentInput): Promise<StudentDocument> {
    const existingStudent = await studentRepository.findById(id);
    if (!existingStudent) {
      throw ApiError.notFound("Student not found");
    }

    if (payload.admissionNumber && payload.admissionNumber !== existingStudent.admissionNumber) {
      const duplicate = await studentRepository.findByAdmissionNumber(payload.admissionNumber);
      if (duplicate) {
        throw ApiError.conflict("Admission number already exists");
      }
    }

    if (payload.rollNumber || payload.class || payload.section) {
      const rollNumber = payload.rollNumber ?? existingStudent.rollNumber;
      const studentClass = payload.class ?? existingStudent.class;
      const section = payload.section ?? existingStudent.section;
      const rollTaken = await studentRepository.existsByRollNumberInClass(
        rollNumber,
        studentClass,
        section,
        id
      );
      if (rollTaken) {
        throw ApiError.conflict("Roll number already exists in this class and section");
      }
    }

    const updateData: Partial<StudentDocument> = { ...payload };

    // If any fee component changed, totalFee/dueFee are derived values and
    // must be recalculated here — the schema's `default` only fires on
    // document creation, never on update.
    const feeFieldsChanged =
      payload.tuitionFee !== undefined ||
      payload.hostelFee !== undefined ||
      payload.miscellaneousFee !== undefined;

    if (feeFieldsChanged) {
      const tuitionFee = payload.tuitionFee ?? existingStudent.tuitionFee;
      const hostelFee = payload.hostelFee ?? existingStudent.hostelFee ?? 0;
      const miscellaneousFee = payload.miscellaneousFee ?? existingStudent.miscellaneousFee ?? 0;
      const totalFee = tuitionFee + hostelFee + miscellaneousFee;

      const totalPaid = await paymentRepository.sumByStudent(id);
      const dueFee = Math.max(totalFee - totalPaid, 0);

      updateData.totalFee = totalFee;
      updateData.dueFee = dueFee;
    }

    const updatedStudent = await studentRepository.updateById(id, updateData);
    if (!updatedStudent) {
      throw ApiError.notFound("Student not found");
    }
    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<StudentDocument> {
    const deleted = await studentRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound("Student not found");
    }
    return deleted;
  }
}

export const studentService = new StudentService();
