import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from '@common/helpers/logger';
import { ConfigService } from '@nestjs/config';
import { getAppConfig } from './config/config';
import { RequestMethod } from '@nestjs/common';
import { dbSetup } from '@common/db/setup';

export let CONFIG: ReturnType<typeof getAppConfig>;
async function bootstrap() {
  dbSetup()
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    "origin": "*"
  });
  app.setGlobalPrefix('api', {
  exclude: [{ path: 'health', method: RequestMethod.GET }],
});

  const configService = app.get(ConfigService);
  CONFIG = getAppConfig(configService);

    app.useLogger(
    logger({
      APP_NAME: CONFIG.APP_NAME,
      APP_ENV: CONFIG.APP_ENV,
    }),
  );
  await app.listen(process.env.PORT ?? 7321);
}
bootstrap();
