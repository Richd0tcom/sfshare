import { Request, Response } from "express";
import logger from "../utils/logger";
import pool from "../db/config";
import { AuthenticatedRequest } from "../types";

const fetchLogs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = req.query.userId as string;
      const action = req.query.action as string;
      const resourceType = req.query.resourceType as string;

      let whereClause = '';
      const queryParams: any[] = [];
      let paramIndex = 1;

      const conditions: string[] = [];

      if (userId) {
        conditions.push(`al.user_id = ${paramIndex}`);
        queryParams.push(userId);
        paramIndex++;
      }

      if (action) {
        conditions.push(`al.action = ${paramIndex}`);
        queryParams.push(action);
        paramIndex++;
      }

      if (resourceType) {
        conditions.push(`al.resource_type = ${paramIndex}`);
        queryParams.push(resourceType);
        paramIndex++;
      }

      if (conditions.length > 0) {
        whereClause = `WHERE ${conditions.join(' AND ')}`;
      }

      // Get total count
      const countResult = await pool.query(
        `SELECT COUNT(*) FROM audit_logs al ${whereClause}`,
        queryParams
      );
      const total = parseInt(countResult.rows[0].count);

      // Get paginated results
      const offset = (page - 1) * limit;
      queryParams.push(limit, offset);

      const auditResult = await pool.query(
        `SELECT al.*, u.email as user_email 
         FROM audit_logs al 
         JOIN users u ON al.user_id = u.id 
         ${whereClause} 
         ORDER BY al.created_at DESC 
         LIMIT ${paramIndex} OFFSET ${paramIndex + 1}`,
        queryParams
      );

      const totalPages = Math.ceil(total / limit);

      res.json({
        logs: auditResult.rows,
        total,
        page,
        totalPages
      });
    } catch (error: any) {
      logger.error('Audit logs retrieval error:', error);
      res.status(500).json({ error: 'Failed to retrieve audit logs' });
    }
  }