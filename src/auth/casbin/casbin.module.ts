import { Module, DynamicModule, Global } from '@nestjs/common';
import { CasbinService } from './casbin.service';
import { CasbinModuleOptions } from '@common/interfaces/casbin-options.interface';
import { CasbinGuard } from '../guards/casbin.guard';
import { CASBIN_ENFORCER } from './casbin.constants';

@Global()
@Module({})
export class CasbinModule {
  static forRoot(options: CasbinModuleOptions): DynamicModule {
    return {
      module: CasbinModule,
      providers: [
        {
          provide: CASBIN_ENFORCER,
          useValue: options.enforcer,
        },
        CasbinService,
        CasbinGuard,
      ],
      exports: [CasbinService, CasbinGuard, CASBIN_ENFORCER],
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<CasbinModuleOptions> | CasbinModuleOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: CasbinModule,
      providers: [
        {
          provide: CASBIN_ENFORCER,
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args);
            return config.enforcer;
          },
          inject: options.inject || [],
        },
        CasbinService,
        CasbinGuard,
      ],
      exports: [CasbinService, CasbinGuard, CASBIN_ENFORCER],
    };
  }
}