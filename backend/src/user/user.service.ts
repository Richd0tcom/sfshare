import { User, Role } from '@common/schema';
import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CreateUserInput, UpdateUserInput } from './dto/input/user.input';
import { CreateRoleInput, UpdateRoleInput } from './dto/input/role.input';


@Injectable()
export class UserService {
  constructor(
    @Inject('User') private userModel: ModelClass<User>,
    @Inject('Role') private rolesModel: ModelClass<Role>,) {

  }
  async create(input: CreateUserInput) {
    return await this.userModel.query().insert(input)
  }


  async findOne(id: string) {
    return await this.userModel.query().findById(id).withGraphJoined('[role]');
  }

  async update(id: string, input: UpdateUserInput) {
    return await this.userModel.query().patchAndFetchById(id, input);
  }

  async createRole(input: CreateRoleInput) {
    return await this.rolesModel.query().insert(input)
  }

  async updateRole(id: string, input: UpdateRoleInput) {
   return await this.userModel.query().patchAndFetchById(id, input);
  }
}
