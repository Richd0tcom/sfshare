import { Model } from "objection";
import mixins from "../db/mixin";


export class RolePermission extends mixins(Model){
    static tableName: string = 'rolePermissions';


    public readonly id: string;

    public roleId: string;
    public name: string;
    public object: string;
    public action: string;


    public createdAt: Date | string;
}
