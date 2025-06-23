import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { AuditModule } from './audit/audit.module';
import { SocketModule } from './socket/socket.module';
import { getConfig } from './config/config';
import { DbModule } from '@common/db/db.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    DbModule,

    ConfigModule.forRoot({
      isGlobal: true,
      load: [()=> getConfig],
    }),
     EventEmitterModule.forRoot({ global: true }),
    SocketModule,

    AuthModule,

    UserModule,

    FileModule,

    AuditModule,

    

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
