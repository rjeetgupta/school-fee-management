import { AdminDocument, AdminModel } from "@models/admin.model";

class AdminRepository {
    async findByEmail(email: string): Promise<AdminDocument | null> {
        return AdminModel.findOne({ email: email.toLowerCase() }).exec();
    }

    async findById(id: string): Promise<AdminDocument | null> {
        return AdminModel.findById(id).exec();
    }

    async create(data: Partial<AdminDocument>): Promise<AdminDocument> {
        return AdminModel.create(data)
    }
}

export const adminRepository = new AdminRepository();