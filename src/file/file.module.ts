import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {accessSync, mkdirSync} from 'node:fs';
import { SocketModule } from 'src/socket/socket.module';
import { SocketGateway } from 'src/socket/socket.gateway';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: (req, file, cb) => {

            const uploadPath = configService.get<string>('MULTER_DEST') || './uploads';
            try {
              accessSync(uploadPath);
            } catch {
              mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, configService.get<string>('MULTER_DEST') || './uploads');
          },
          filename: (req, file, cb) => {
            const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
            cb(null, uniqueName);
          }
        })
      }),
      inject: [ConfigService],
    }),
    SocketModule
  ],
  controllers: [FileController],
  providers: [FileService, SocketGateway],
})
export class FileModule { }
