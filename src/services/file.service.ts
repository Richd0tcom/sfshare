import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { FileRecord } from '../types';
import logger from '../utils/logger';
import pool from '../db/config';
import { encryptFile, generateEncryptionKey } from '../utils/encryption';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';


const ensureUploadDir = async () => {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
};

export const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await ensureUploadDir();
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    },
    fileFilter: (req, file, cb) => {
       
        cb(null, true);
    }
});

export class FileService {
    static async saveFile(
        file: Express.Multer.File,
        ownerId: string,
        permissionLevel: string = 'private',
        tags: string[] = [],
        metadata: Record<string, any> = {}
    ): Promise<FileRecord> {
        let encryptionKey: string | undefined;
        let finalFilePath = file.path;

        
        if (process.env.ENCRYPT_FILES === 'true') {
            encryptionKey = generateEncryptionKey();
            const fileBuffer = await fs.readFile(file.path);
            const { encrypted, iv, tag } = encryptFile(fileBuffer, encryptionKey);

            const encryptedPath = `${file.path}.encrypted`;
            const encryptedData = {
                data: encrypted.toString('base64'),
                iv,
                tag
            };

            await fs.writeFile(encryptedPath, JSON.stringify(encryptedData));
            await fs.unlink(file.path); // Remove original file
            finalFilePath = encryptedPath;
        }

        const result = await pool.query(
            `INSERT INTO files (filename, original_name, file_path, file_size, mime_type, encryption_key, owner_id, permission_level, tags, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
            [
                file.filename,
                file.originalname,
                finalFilePath,
                file.size,
                file.mimetype,
                encryptionKey,
                ownerId,
                permissionLevel,
                tags,
                JSON.stringify(metadata)
            ]
        );

        logger.info(`File uploaded: ${file.originalname} by user ${ownerId}`);
        return result.rows[0];
    }

    static async getFiles(
        userId: string,
        userRole: string,
        page: number = 1,
        limit: number = 10,
        search?: string,
        permissionLevel?: string,
        tags?: string[]
    ): Promise<{ files: FileRecord[]; total: number; page: number; totalPages: number }> {
        let whereClause = '';
        const queryParams: any[] = [];
        let paramIndex = 1;

        
        const conditions: string[] = [];

        
        if (userRole !== 'admin') {
            conditions.push(`(owner_id = $${paramIndex} OR permission_level IN ('public', 'shared'))`);
            queryParams.push(userId);
            paramIndex++;
        }

        
        if (search) {
            conditions.push(`(original_name ILIKE $${paramIndex} OR tags && ARRAY[$${paramIndex}])`);
            queryParams.push(`%${search}%`);
            paramIndex++;
        }

        
        if (permissionLevel) {
            conditions.push(`permission_level = $${paramIndex}`);
            queryParams.push(permissionLevel);
            paramIndex++;
        }

        
        if (tags && tags.length > 0) {
            conditions.push(`tags && $${paramIndex}`);
            queryParams.push(tags);
            paramIndex++;
        }

        if (conditions.length > 0) {
            whereClause = `WHERE ${conditions.join(' AND ')}`;
        }

        
        const countResult = await pool.query(
            `SELECT COUNT(*) FROM files ${whereClause}`,
            queryParams
        );
        const total = parseInt(countResult.rows[0].count);

        // paginate
        const offset = (page - 1) * limit;
        queryParams.push(limit, offset);

        const filesResult = await pool.query(
            `SELECT f.*, u.email as owner_email 
         FROM files f 
         JOIN users u ON f.owner_id = u.id 
         ${whereClause} 
         ORDER BY f.created_at DESC 
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            queryParams
        );

        const totalPages = Math.ceil(total / limit);

        return {
            files: filesResult.rows,
            total,
            page,
            totalPages
        };
    }

    static async getFileById(fileId: string, userId: string, userRole: string): Promise<FileRecord | null> {
        let query = `
        SELECT f.*, u.email as owner_email 
        FROM files f 
        JOIN users u ON f.owner_id = u.id 
        WHERE f.id = $1
      `;
        const queryParams = [fileId];

        
        if (userRole !== 'admin') {
            query += ` AND (f.owner_id = $2 OR f.permission_level IN ('public', 'shared'))`;
            queryParams.push(userId);
        }

        const result = await pool.query(query, queryParams);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    static async updateFileMetadata(
        fileId: string,
        userId: string,
        userRole: string,
        updates: Partial<Pick<FileRecord, 'permission_level' | 'tags' | 'metadata'>>
    ): Promise<FileRecord | null> {
        
        const file = await this.getFileById(fileId, userId, userRole);
        if (!file) {
            return null;
        }

        
        if (file.owner_id !== userId && userRole !== 'admin') {
            throw new Error('Insufficient permissions to update file');
        }

        const updateFields: string[] = [];
        const queryParams: any[] = [];
        let paramIndex = 1;

        if (updates.permission_level) {
            updateFields.push(`permission_level = $${paramIndex}`);
            queryParams.push(updates.permission_level);
            paramIndex++;
        }

        if (updates.tags) {
            updateFields.push(`tags = $${paramIndex}`);
            queryParams.push(updates.tags);
            paramIndex++;
        }

        if (updates.metadata) {
            updateFields.push(`metadata = $${paramIndex}`);
            queryParams.push(JSON.stringify(updates.metadata));
            paramIndex++;
        }

        if (updateFields.length === 0) {
            return file;
        }

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        queryParams.push(fileId);

        const result = await pool.query<FileRecord>(
            `UPDATE files SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            queryParams
        );

        logger.info(`File metadata updated: ${fileId} by user ${userId}`);
        return result.rows[0];
    }
}