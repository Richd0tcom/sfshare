import { Global, Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import config from './knexfile';
import { ConfigService } from '@nestjs/config';
import { AuditLog, File, Role, RolePermission, User } from '@common/schema';
import { Model } from 'objection';



const models = [User, File, Role, RolePermission, AuditLog];
const providers = models.map((model: typeof Model) => {
  return {
    provide: model.name,
    useValue: model,
  };
});

/**
 * Database module for providing queries
 */
@Global()
@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        config: config[configService.get<string>('NODE_ENV') || 'development'],
      }),
      inject: [ConfigService]
    }),
  ],
  providers: [...providers],
  exports: [...providers],
})
export class DbModule {}
