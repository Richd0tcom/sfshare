import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters } from '@nestjs/common';
import { AuditService } from './audit.service';
import { HttpExceptionFilter } from '@common/filters/exception.filter';

@UseFilters(HttpExceptionFilter)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}



  @Get()
  findAll() {
    return this.auditService.findAll();
  }

  
}
