import { UserWithAuth } from "src/auth/dto/responses/auth.response";

export interface CasbinRequest extends Request {
  casbin?: {
    enforce: (obj: string, act: string) => Promise<boolean>;
    hasRole: (role: string) => Promise<boolean>;
    getRoles: () => Promise<string[]>;
    getPermissions: () => Promise<string[][]>;
  };

  user?: UserWithAuth | any 
}