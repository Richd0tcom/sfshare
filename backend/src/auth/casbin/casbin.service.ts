import { Injectable, Inject } from '@nestjs/common';
import { Enforcer } from 'casbin';
import { CASBIN_ENFORCER } from './casbin.constants';

@Injectable()
export class CasbinService {
  constructor(
    @Inject(CASBIN_ENFORCER) private readonly enforcer: Enforcer,
  ) {}

  async enforce(sub: string, obj: string, act: string): Promise<boolean> {
   
    return await this.enforcer.enforce(sub, obj, act);
  }

  async addPolicy(sub: string, obj: string, act: string): Promise<boolean> {
    return this.enforcer.addPolicy(sub, obj, act);
  }

  async removePolicy(sub: string, obj: string, act: string): Promise<boolean> {
    return this.enforcer.removePolicy(sub, obj, act);
  }

  async addRoleForUser(user: string, role: string): Promise<boolean> {
    return this.enforcer.addRoleForUser(user, role);
  }

  async deleteRoleForUser(user: string, role: string): Promise<boolean> {
    return this.enforcer.deleteRoleForUser(user, role);
  }

  async getRolesForUser(user: string): Promise<string[]> {
    return this.enforcer.getRolesForUser(user);
  }

  async getUsersForRole(role: string): Promise<string[]> {
    return this.enforcer.getUsersForRole(role);
  }

  async hasRoleForUser(user: string, role: string): Promise<boolean> {
    return this.enforcer.hasRoleForUser(user, role);
  }

  async getPermissionsForUser(user: string): Promise<string[][]> {
    return this.enforcer.getPermissionsForUser(user);
  }

  async hasPermissionForUser(user: string, ...params: string[]): Promise<boolean> {
    return this.enforcer.hasPermissionForUser(user, ...params);
  }

  async addPermissionForUser(user: string, ...params: string[]): Promise<boolean> {
    return this.enforcer.addPermissionForUser(user, ...params);
  }

  async deletePermissionForUser(user: string, ...params: string[]): Promise<boolean> {
    return this.enforcer.deletePermissionForUser(user, ...params);
  }

  async deletePermissionsForUser(user: string): Promise<boolean> {
    return this.enforcer.deletePermissionsForUser(user);
  }

  getEnforcer(): Enforcer {
    return this.enforcer;
  }
}