import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { SocketModule } from 'src/socket/socket.module';
import { SocketGateway } from 'src/socket/socket.gateway';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: multer.diskStorage({
          destination: async (req, file, cb) => {
            await (async() => {
              try {
                await fs.access(configService.get<string>('MULTER_DEST') || './uploads');
              } catch {
                await fs.mkdir(configService.get<string>('MULTER_DEST') || './uploads', { recursive: true });
              }
            })();
            cb(null, configService.get<string>('MULTER_DEST') || './uploads');
          },
          filename: (req, file, cb) => {
            const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
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
