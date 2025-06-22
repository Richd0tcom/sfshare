import { Model, RelationMappings, RelationMappingsThunk, StaticHookArguments } from "objection";
import mixins from "../db/mixin";
import { Role } from "./roles.schema";
import { hashPassword } from "@common/helpers/password";


export class User extends mixins(Model){
    static tableName: string = 'users';


    public readonly id: string;


    public email: string;

    public password: string;

    public roleId: string;

    public createdAt: Date | string;
    public updatedAt: Date | string;
    public role: Role

    static hidden = ["password",] 

    static relationMappings: RelationMappings | RelationMappingsThunk = {


    role: {
      relation: Model.HasOneRelation,
      modelClass: User,
      join: {
        from: 'users.roleId',
        to: 'roles.id',
      },
    },
  };

  static beforeInsert(args: StaticHookArguments<User>) {
      args.inputItems = args.inputItems.map((item) => {
        return User.fromJson({
          ...item,
          password: hashPassword(item.password),
        });
      })
  }
}
