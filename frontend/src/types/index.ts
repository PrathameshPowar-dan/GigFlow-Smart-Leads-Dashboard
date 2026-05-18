export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Sales';
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}