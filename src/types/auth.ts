export interface Role {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    username: string;
    name: string;
    last_name: string;
    email: string;
    role_id: number;
    is_active: number;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: Role;
}
