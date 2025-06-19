import { Request } from "express"

export interface User {
    role: string
}

export interface FileRecord {

}

export interface AuditLog {

}

export interface AuthenticatedRequest extends Request {
    user?: User;
}