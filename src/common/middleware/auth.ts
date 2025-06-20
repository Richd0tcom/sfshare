import { expressjwt } from "express-jwt";
import { AuthenticatedRequest } from "../../types";
import { Response, NextFunction } from "express";
import { getEnforcer } from "../../conf/casbin";
import roleService from "../../services/role.service";
import logger from "../../utils/logger";


export const Authenticate = () => expressjwt({
    secret: process.env.JWT_SECRET!,
    algorithms: ['HS256'],
    requestProperty: 'user',
    
}).unless({ path: [/^\/api\/auth\/.*/,  /^\/api\/frame\/.*/]})

export const authorize = (resource: string, action: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          
          res.status(401).json({ error: 'Authentication required' });
          return;
        }
        

        const role = await roleService.findById(req.user.role_id)
        console.log(role)
  
        const enforcer = getEnforcer();

        const allowed = await enforcer.enforce(role.name, resource, action);
  
        if (!allowed) {
          res.status(403).json({ error: 'Insufficient permissions' });
          return;
        }

        req.user.role = role
        console.log('user for auth',req.user)
  
        next();
      } catch (error) {
        logger.error('Authorization error:', error);
        res.status(500).json({ error: 'Authorization check failed' });
      }
    };
  };


