export interface IAdmin {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  email?: string;
  admissionNumber?: string;
  role: "admin" | "student";
}

export interface LoginResult {
  token: string;
  admin: {
    id: string;
    email: string;
  };
}
