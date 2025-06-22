import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateAuditInput } from 'src/audit/dto/input/create-audit.input';


@Injectable()
export class EventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit<T>(event: string, ...args: T[]): void {
    this.eventEmitter.emit(event, ...args);
  }

  emitActivity(
    event: string | string[],
    action: string,

    details: Record<string, unknown>,
        userId?: string,
  ): void {
    if (Array.isArray(event)) {
      event.forEach((e) => this.emit<CreateAuditInput>(e, { action, details, userId }));
      return;
    }
    this.emit<CreateAuditInput>(event, {
      action,
      details,
      userId
    });
  }
}
