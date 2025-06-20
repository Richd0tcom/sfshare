import { Request } from "express"

export interface User {
    id: string;
    email: string;
    password?: string;
    role: string;
    created_at: Date;
    updated_at: Date;
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

export interface AuthenticatedRequest extends Request {
    user?: User;
}

export interface UserTokenResponse {
    user: User
    token: string
}

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
  }