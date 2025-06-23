import { Controller, Get, Post, Body, Patch, Param, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput, UpdateUserInput } from './dto/input/user.input';
import { HttpExceptionFilter } from '@common/filters/exception.filter';
import { RequirePermission } from '@common/decorators/casbin.decorator';

@UseFilters(HttpExceptionFilter)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @RequirePermission('users', 'create')
  @Post()
  create(@Body() input: CreateUserInput) {
    return this.userService.create(input);
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateUserInput) {
    return this.userService.update(id, input);
  }
}
