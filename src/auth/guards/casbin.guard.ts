import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CASBIN_PERMISSION_KEY, CASBIN_ROLE_KEY } from '../casbin/casbin.constants';
import { CasbinService } from '../casbin/casbin.service';
import { logger as lg } from '@common/helpers/logger';
import { Role } from '@common/schema';
import { ModelClass } from 'objection';

@Injectable()
export class CasbinGuard implements CanActivate {
    private readonly logger = new Logger(CasbinGuard.name);
  constructor(
    private reflector: Reflector,
    private casbinService: CasbinService,
    @Inject('Role') private roleModel: ModelClass<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    this.logger.log(`User: ${JSON.stringify(user)}`);
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const role = await this.roleModel.query().findById(user.roleId)
    console.log(role)
    this.logger.log(`Role: ${JSON.stringify(role)}`);
    if(!role) {
      throw new ForbiddenException('invalid credentials')
    }
    user.role = role;

    // Check for permission-based access
    const requiredPermission = this.reflector.getAllAndOverride<{
      resource: string;
      action: string;
    }>(CASBIN_PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    console.log('reqiPerm: ', requiredPermission)
    if (requiredPermission) {
      const hasPermission = await this.casbinService.enforce(
        user.role.name,
        requiredPermission.resource,
        requiredPermission.action,
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          `Access denied: insufficient permissions for ${requiredPermission.action} on ${requiredPermission.resource}`,
        );
      }
    }

    // Check for role-based access
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      CASBIN_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles = await this.casbinService.getRolesForUser(
        user.id || user.sub,
      );

      const hasRole = requiredRoles.some(role => userRoles.includes(role));

      if (!hasRole) {
        throw new ForbiddenException(
          `Access denied: requires one of roles [${requiredRoles.join(', ')}]`,
        );
      }
    }

    return true;
  }
}
