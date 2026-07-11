export interface Admin {
    id: string;
    email: string;
}

export interface LoginResult {
    token: string;
    admin: Admin;
}
