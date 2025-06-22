
export const getConfig = () => ({
    port: parseInt(process.env.PORT as string, 10) || 3000,
    database: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT)|| 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    JWT_SECRET: process.env.JWT_SECRET,
    APP_NAME: process.env.APP_NAME || 'MyApp',
    APP_ENV: process.env.APP_ENV || 'development',
});


import { ConfigService } from '@nestjs/config';

const config = (configService: ConfigService) => ({
    database: {
        host: configService.getOrThrow<string>('DB_HOST'),
        port: configService.getOrThrow<number>('DB_PORT'),
        database: configService.getOrThrow<string>('DB_NAME'),
        user: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
    },
    JWT_SECRET: configService.getOrThrow<string>('JWT_SECRET'),
    APP_NAME: configService.getOrThrow<string>('APP_NAME') || 'MyApp',
    APP_ENV: configService.getOrThrow<string>('APP_ENV') || 'development',
});

export const getAppConfig = (
  configService: ConfigService,
): ReturnType<typeof config> => config(configService);
