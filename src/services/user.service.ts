import pool from "../db/config";
import bcrypt from 'bcrypt'
import { User } from "../types";

export const createUser = async (email: string, password: string, role: string): Promise<User> => {    
    const hashedPassword = await bcrypt.hash(password, 12);


    const result = await pool.query<User>(
        `INSERT INTO users (email, password, role) 
         VALUES ($1, $2, $3) 
         RETURNING id, email, role, created_at, updated_at`,
        [email, hashedPassword, role]
      );

      return result.rows[0];
}

export const getUserById = async (id: string): Promise<User> => {
    const result = await pool.query<User>(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );

    return result.rows[0];
} 

export const getUserByEmail = async (email: string): Promise<User> => {
    const result = await pool.query<User>(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

    return result.rows[0];
}

