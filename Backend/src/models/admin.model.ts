import { Schema, model, Document } from "mongoose";
import { IAdmin } from "@app-types/auth.types";

export interface AdminDocument extends IAdmin, Document {
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<AdminDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const AdminModel = model<AdminDocument>("Admin", adminSchema);
