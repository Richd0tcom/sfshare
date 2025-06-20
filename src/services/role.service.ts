import pool from "../db/config";
import { Role } from "../types";

class RoleService {
    async insert(name: string) {
        const result = await pool.query(`INSERT INTO roles (name) VALUES $1`, [name])
        return result.rows[0]
    }

    async findById(id: string) {
        const result = await pool.query<Role>(`SELECT * FROM roles WHERE id = $1`, [id])
        return result.rows[0]
    }

    async getRoleByName(name: string) {
        const result = await pool.query<Role>(`SELECT * FROM roles WHERE name = $1 LIMIT 1`, [name])

        return result.rows[0]
    }
}

export default new RoleService()