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
    email: string;
}

export interface LoginResult {
    token: string;
    admin: {
        id: string;
        email: string;
    };
}
