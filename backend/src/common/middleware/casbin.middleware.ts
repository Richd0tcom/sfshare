import { CasbinRequest } from '@common/interfaces/request.interface';
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CasbinService } from 'src/auth/casbin/casbin.service';


@Injectable()
export class CasbinMiddleware implements NestMiddleware {
  constructor(private readonly casbinService: CasbinService) {}

  async use(req: CasbinRequest, res: Response, next: NextFunction) {
    const user = req.user as any;
    
    if (!user) {
      return next();
    }

    // Add casbin helper methods to request object
    req.casbin = {
      enforce: (obj: string, act: string) =>
        this.casbinService.enforce(user.id || user.sub, obj, act),
      hasRole: (role: string) =>
        this.casbinService.hasRoleForUser(user.id || user.sub, role),
      getRoles: () =>
        this.casbinService.getRolesForUser(user.id || user.sub),
      getPermissions: () =>
        this.casbinService.getPermissionsForUser(user.id || user.sub),
    };

    next();
  }
}