import { Model } from "objection";
import mixins from "../db/mixin";
import { UserRole } from "@common/enums";


export class Role extends mixins(Model){
    static tableName: string = 'roles';


    public readonly id: string;


    public name: UserRole;

    public status: string;

    public createdAt: Date | string;
}
