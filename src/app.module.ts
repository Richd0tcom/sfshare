import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { AuditModule } from './audit/audit.module';
import { SocketModule } from './socket/socket.module';
import { getAppConfig, getConfig } from './config/config';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      load: [()=> getConfig],
    }),


    AuthModule,

    UserModule,

    FileModule,

    AuditModule,

    SocketModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
