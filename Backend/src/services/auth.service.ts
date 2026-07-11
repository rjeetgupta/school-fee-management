import { LoginInput, LoginResult } from "@app-types/auth.type";
import { AdminDocument } from "@models/admin.model";
import { adminRepository } from "@repositories/admin.repository";
import { ApiError } from "@utils/ApiError";
import { signToken } from "@utils/jwt";
import bcrypt from "bcryptjs";


class AuthService {
    async login({ email, password }: LoginInput): Promise<LoginResult> {
        const admin = await adminRepository.findByEmail(email);

        if (!admin) {
            throw ApiError.unauthorized("Invalid email or password")
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!isPasswordCorrect) {
            throw ApiError.unauthorized("Invalid email or password");
        }

        const token = signToken({ id: admin._id.toString(), email: admin.email });
        
        return {
            token,
            admin: { id: admin._id.toString(), email: admin.email }
        };
    }
}

export const authService = new AuthService();