import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@common/schema';
import { ModelClass } from 'objection';
import { LoginInput } from './dto/input/login.input';
import { checkPassword } from '@common/helpers/password';
import { AuthResponse } from './dto/responses/auth.response';
import { RegisterInput } from './dto/input/register.input';
import { UserRole } from '@common/enums';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('User') private userModel: ModelClass<User>,
     @Inject('Role') private rolesModel: ModelClass<Role>,
  ) { }
  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.userModel.query().findOne({ email: input.email }).withGraphJoined('[role]');
    if (!user || await checkPassword(user.password, input.password)) {
      throw new UnauthorizedException('email or password incorrect')
    }

    const accessToken = this.jwtService.sign({
      id: user.id,
      roleId: user.roleId
    })

    return {
      user,
      accessToken
    }
  }
  async register(input: RegisterInput) {
    let user = await this.userModel.query().findOne({ email: input.email }).withGraphJoined('[role]');


    if (user) {
      throw new BadRequestException('email already exists')
    }

    const employeeRole = await this.rolesModel.query().findOne({name: UserRole.Employee}).throwIfNotFound()

    user  = await this.userModel.query().insert({
      email: input.email,
      password: input.password,
      roleId: employeeRole.id
    })

    return user
  }

  async profile(id: string) {
   const user = await this.userModel.query().findOne({ id }).withGraphFetched('[role]');

      if (!user ) {
      throw new UnauthorizedException('email or password incorrect')
    }

    return user
  }

}
