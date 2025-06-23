import { SetMetadata } from '@nestjs/common';
import { CASBIN_PERMISSION_KEY, CASBIN_ROLE_KEY,  } from 'src/auth/casbin/casbin.constants';

export const RequirePermission = (resource: string, action: string) =>
  SetMetadata(CASBIN_PERMISSION_KEY, { resource, action });

export const RequireRole = (...roles: string[]) =>
  SetMetadata(CASBIN_ROLE_KEY, roles);

