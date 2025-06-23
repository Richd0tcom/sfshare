import { AuditLog } from "@common/schema";
import { PartialType } from "@nestjs/mapped-types";

export class CreateAuditInput extends PartialType(AuditLog) {}