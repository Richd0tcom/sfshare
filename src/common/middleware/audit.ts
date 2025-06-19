import { Response, NextFunction } from "express";
import {  AuthenticatedRequest } from "../../types";
import pool from "../../db/config";

export const auditLog = (action: string, resourceType: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      // Store original end function
      const originalEnd = res.end;
      
      // Override end function to capture response
      res.end = function(chunk?: any, encoding?: any) {
        // Call original end function
        originalEnd.call(this, chunk, encoding);
        
        // Log the audit entry
        if (req.user && res.statusCode < 400) {
          const resourceId = req.params.id || req.body?.id || null;
          
          pool.query(
            `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              req.user.id,
              action,
              resourceType,
              resourceId,
              JSON.stringify({
                method: req.method,
                url: req.url,
                statusCode: res.statusCode
              }),
              req.ip,
              req.get('User-Agent') || null
            ]
          ).catch(error => {
            // logger.error('Audit log error:', error);
          });
        }
      };

      
      next();
    };
  };