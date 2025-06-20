import pool from "../db/config";
import { User, UserTokenResponse } from "../types";
import logger from "../utils/logger";
import { compare, hash } from 'bcrypt'
import UserService from "./user.service";
import * as jwt from 'jsonwebtoken';
import RoleService from "./role.service";

class AuthService {
    async registerUser(email: string, password: string): Promise<User> {
        const hashedPassword = await hash(password, 12);

        const role = await RoleService.getRoleByName('employee')
        console.log(role)

        const user = await UserService.createUser(email, hashedPassword, role.id)
        return user;
    }

    async loginUser(email: string, password: string): Promise<UserTokenResponse> {
        let user = await UserService.getUserByEmail(email)

        if (!user) {
            throw new Error('Invalid credentials');
        }


        const isValidPassword = await compare(password, user.password!);

        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        const payload = {
            id: user.id,
            email: user.email,
            role_id: user.role_id
        };

        console.log(process.env.JWT_SECRET!)
        const token = jwt.sign(payload, process.env.JWT_SECRET!);

        delete user.password;

        logger.info(`User logged in: ${email}`);
        return { user, token };
    }
}

export default new AuthService()