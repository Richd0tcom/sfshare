import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from '@common/db/db.module';

@Module({
  imports: [
    DbModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
