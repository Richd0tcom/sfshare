import { Request } from "express"

export interface User {
    id: string;
    email: string;
    password?: string;
    role_id: string;
    created_at: Date;
    updated_at: Date;

    role: Role
}

export interface FileRecord {
    id: string;
    filename: string;
    original_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    encryption_key?: string;
    owner_id: string;
    permission_level: string;
    tags: string[];
    metadata: Record<string, any>;
    created_at: Date;
    updated_at: Date;
}

export interface AuditLog {
    id: string;
    user_id: string;
    action: string;
    resource_type: string;
    resource_id: string;
    details: Record<string, any>;
    ip_address: string;
    user_agent: string;
    created_at: Date;
}

export interface Role {
    id: string;
    name: string;
    status: string;
    created_at: string
}

export interface RolePermissions {
    id: string;
    role_id:string;
    role_name: string;
    object: string;
    action: string;
    created_at: string
}

export interface AuthenticatedRequest extends Request {
    user: JWTPayload;
}

export interface UserTokenResponse {
    user: User
    token: string
}

export interface JWTPayload {
    id: string;
    email: string;
    role_id: string;
    iat?: number;
    exp?: number;

    role: Role
}