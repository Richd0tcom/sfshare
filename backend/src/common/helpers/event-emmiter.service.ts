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
    input: CreateAuditInput,
  ): void {
    if (Array.isArray(event)) {
      event.forEach((e) => this.emit<CreateAuditInput>(e, input));
      return;
    }
    this.emit<CreateAuditInput>(event, input);
  }
}
