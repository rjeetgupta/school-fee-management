import { Schema, model, Document } from "mongoose";
import { IAdmin } from "@app-types/auth.type";

export interface AdminDocument extends IAdmin, Document {
    createdAt: Date,
    updatedAt: Date,
}

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });


export const AdminModel = model<AdminDocument>("Admin", adminSchema)