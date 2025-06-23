import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/input/register.input';
import { LoginInput } from './dto/input/login.input';
import { HttpExceptionFilter } from '@common/filters/exception.filter';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserWithAuth } from './dto/responses/auth.response';

@UseFilters(HttpExceptionFilter)
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  profile(@CurrentUser() input: UserWithAuth) {
    return this.authService.profile(input.id);
  }
}
