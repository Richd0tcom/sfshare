import { Model } from "objection";
import mixins from "../db/mixin";


export class AuditLog extends mixins(Model) {
    static tableName: string = 'auditLogs';

    public readonly id: string;

    public readonly userId: string;
    public readonly action: string;
    public readonly resourceType: string;
    public readonly resourceId: string;
    public readonly details: Record<string, any>;
    public readonly ipAddress?: string;
    public readonly userAgent?: string;
}
