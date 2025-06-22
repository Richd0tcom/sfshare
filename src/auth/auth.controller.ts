import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/input/register.input';
import { LoginInput } from './dto/input/login.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() input: RegisterInput) {
    return this.authService.register(input);
  }

  @Post('login')
  login(@Body() createAuthDto: LoginInput) {
    return this.authService.login(createAuthDto);
  }

}
