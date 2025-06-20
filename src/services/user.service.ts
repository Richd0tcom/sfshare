import pool from "../db/config";

import { User } from "../types";


class UserService {
  async createUser(email: string, password: string, role: string): Promise<User> {
    const result = await pool.query<User>(
      `INSERT INTO users (email, password, role) 
         VALUES ($1, $2, $3) 
         RETURNING id, email, role, created_at, updated_at`,
      [email, password, role]
    );

    return result.rows[0];
  }

  async getUserById(id: string): Promise<User> {
    const result = await pool.query<User>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    return result.rows[0];
  }

  async getUserByEmail(email: string): Promise<User> {
    const result = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0];
  }
}



export default new UserService()