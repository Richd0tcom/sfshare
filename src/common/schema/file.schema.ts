import { Model } from "objection";
import mixins from "../db/mixin";
import { PermissionLevel } from "@common/enums";


export class File extends mixins(Model) {
    static tableName: string = 'files';

    public readonly id: string;


    public filename: string;
    public originalName: string;
    public filePath: string;
    public fileSize: number;
    public mimeType: string;
    public encryptionKey?: string;
    public ownerId: string;
    public permissionLevel: PermissionLevel;
    public tags?: string[];
    public metadata?: Record<string, any> | string;

    public createdAt: Date | string;
    public updatedAt: Date | string;
}
