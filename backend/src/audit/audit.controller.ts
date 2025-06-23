import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { HttpExceptionFilter } from '@common/filters/exception.filter';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RequirePermission } from '@common/decorators/casbin.decorator';

@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}



  @RequirePermission('audit', 'read')
  @Get()
  findAll() {
    return this.auditService.findAll();
  }

  
}
