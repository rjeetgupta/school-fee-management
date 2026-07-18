import { Schema, model, Document } from "mongoose";
import { IStudent, StudentStatus } from "@app-types/student.types";

export interface StudentDocument extends IStudent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<StudentDocument>(
  {
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    fatherName: {
      type: String,
      required: true,
      trim: true,
    },

    class: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    section: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    whatsappNumber: {
      type: String,
      trim: true,
    },

    tuitionFee: {
      type: Number,
      required: true,
      min: 0,
    },

    hostelFee: {
      type: Number,
      min: 0,
      default: 0,
    },

    miscellaneousFee: {
      type: Number,
      min: 0,
      default: 0,
    },

    address: {
      type: String,
      trim: true,
    },

    // NOTE: these `default` functions only run on document CREATION.
    // Whenever tuitionFee/hostelFee/miscellaneousFee change on an existing
    // student, or whenever a payment is deposited/edited/deleted,
    // totalFee/dueFee must be recalculated explicitly in the service layer
    // (see student.service.ts and payment.service.ts). Mongoose defaults
    // alone are NOT enough to keep these in sync after creation.
    totalFee: {
      type: Number,
      min: 0,
      default: function (this: StudentDocument) {
        return this.tuitionFee + (this.hostelFee || 0) + (this.miscellaneousFee || 0);
      },
    },

    dueFee: {
      type: Number,
      min: 0,
      default: function (this: StudentDocument) {
        return this.totalFee;
      },
    },

    status: {
      type: String,
      enum: Object.values(StudentStatus),
      default: StudentStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

// Roll Number must be unique within a class + section (Business Rule 2, extended for sections)
studentSchema.index({ class: 1, section: 1, rollNumber: 1 }, { unique: true });

// Text index to support search by name/father name (in addition to regex search)
studentSchema.index({ studentName: "text", fatherName: "text", email: "text" });

export const StudentModel = model<StudentDocument>("Student", studentSchema);
