import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Query, UseFilters, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileInput, UpdateFileInput } from './dto/input/file.input';
import { UserWithAuth } from 'src/auth/dto/responses/auth.response';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { HttpExceptionFilter } from '@common/filters/exception.filter';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RequirePermission } from '@common/decorators/casbin.decorator';
import { CasbinGuard } from 'src/auth/guards/casbin.guard';

@UseFilters(HttpExceptionFilter)
@UseGuards(CasbinGuard)
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @RequirePermission('files', 'create')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: CreateFileInput, @CurrentUser() owner: UserWithAuth) {
    return this.fileService.upload(body, file, owner.id)
  }

  @RequirePermission('files', 'read')
  @Get()
  findAll(@Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('tags') tags: string[],
    @Query('permissionLevel') permissionLevel: string,
    @CurrentUser() user: UserWithAuth
  ) {
    return this.fileService.findAll(user.id, user.role.name, Number(page), Number(limit), search, permissionLevel, tags);
  }

  @RequirePermission('files', 'read')
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: UserWithAuth) {

    return this.fileService.findOne(id,currentUser.id, currentUser.role.name);
  }

  @RequirePermission('files', 'update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateFileInput, @CurrentUser() user: UserWithAuth) {
    return this.fileService.update(id, user.id, user.role.name, body);
  }


}
