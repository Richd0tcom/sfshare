import { Model, RelationMappings, RelationMappingsThunk } from "objection";
import mixins from "../db/mixin";
import { PermissionLevel } from "@common/enums";
import { User } from "./user.schema";


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

    public owner: User;

    static relationMappings: RelationMappings | RelationMappingsThunk = {


        owner: {
            relation: Model.HasOneRelation,
            modelClass: User,
            join: {
                from: 'files.ownerId',
                to: 'users.id',
            },
        },
    };
}
