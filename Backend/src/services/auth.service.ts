import bcrypt from "bcryptjs";
import { adminRepository } from "@repositories/admin.repository";
import { signToken } from "@utils/jwt";
import { ApiError } from "@utils/ApiError";
import { LoginInput, LoginResult } from "@app-types/auth.types";

class AuthService {
  async login({ email, password }: LoginInput): Promise<LoginResult> {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const token = signToken({ id: admin._id.toString(), email: admin.email, role: "admin" });

    return {
      token,
      admin: { id: admin._id.toString(), email: admin.email },
    };
  }
}

export const authService = new AuthService();
