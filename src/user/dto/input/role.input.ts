import { Role, RolePermission } from "@common/schema";
import { PartialType } from "@nestjs/mapped-types";

export class CreateRoleInput extends Role {}
export class UpdateRoleInput extends PartialType(Role) {}

export class CreateRolePermissionInput extends RolePermission {}