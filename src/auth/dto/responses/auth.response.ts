import { Role, User } from "@common/schema"

export class AuthResponse {
    user: Omit<User, 'password'>
    accessToken: string
}

export class UserWithAuth {
    id: string
    roleId: string
    role: Role
}