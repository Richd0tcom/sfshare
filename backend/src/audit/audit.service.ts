import { AuditLog } from '@common/schema';
import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CreateAuditInput } from './dto/input/create-audit.input';
import { OnEvent } from '@nestjs/event-emitter';
import { AppEvents } from '@common/enums';


@Injectable()
export class AuditService {

  constructor(
    @Inject('AuditLog') private auditModel: ModelClass<AuditLog>
  ) {}

  @OnEvent(AppEvents.LogActivity)
  async create(input: CreateAuditInput) {
    await this.auditModel.query().insert(input)
  }

  findAll() {
    return this.auditModel.query();
  }

  findOne(id: number) {
    return `This action returns a #${id} audit`;
  }

}
