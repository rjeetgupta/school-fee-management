import { FilterQuery } from "mongoose";
import { StudentModel, StudentDocument } from "@models/student.model";
import { StudentFilterQuery } from "@app-types/student.types";
import { PaginatedResult } from "@app-types/common.types";

/**
 * Repository layer: the ONLY place that talks to Mongoose/MongoDB
 * for the Student collection. Controllers/services must go through this.
 */
class StudentRepository {
  async create(data: Partial<StudentDocument>): Promise<StudentDocument> {
    return StudentModel.create(data);
  }

  async findById(id: string): Promise<StudentDocument | null> {
    return StudentModel.findById(id).exec();
  }

  async findByAdmissionNumber(admissionNumber: string): Promise<StudentDocument | null> {
    return StudentModel.findOne({ admissionNumber }).exec();
  }

  async countAll(): Promise<number> {
    return StudentModel.countDocuments({}).exec();
  }

  async findAll(filters: StudentFilterQuery): Promise<PaginatedResult<StudentDocument>> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
    const skip = (page - 1) * limit;

    const query: FilterQuery<StudentDocument> = {};

    if (filters.class) {
      query.class = filters.class;
    }

    if (filters.section) {
      query.section = filters.section.toUpperCase();
    }

    if (filters.search) {
      const regex = new RegExp(filters.search, "i");
      query.$or = [
        { admissionNumber: regex },
        { rollNumber: regex },
        { studentName: regex },
        { fatherName: regex },
        { mobileNumber: regex },
        { email: regex },
      ];
    }

    const [items, total] = await Promise.all([
      StudentModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      StudentModel.countDocuments(query).exec(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async updateById(
    id: string,
    data: Partial<StudentDocument>
  ): Promise<StudentDocument | null> {
    return StudentModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async deleteById(id: string): Promise<StudentDocument | null> {
    return StudentModel.findByIdAndDelete(id).exec();
  }

  async existsByRollNumberInClass(
    rollNumber: string,
    studentClass: string,
    section: string,
    excludeId?: string
  ): Promise<boolean> {
    const query: FilterQuery<StudentDocument> = {
      rollNumber,
      class: studentClass,
      section: section.toUpperCase(),
    };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const count = await StudentModel.countDocuments(query).exec();
    return count > 0;
  }
}

export const studentRepository = new StudentRepository();
