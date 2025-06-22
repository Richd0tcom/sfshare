import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';


export const logger = (env: {
  APP_NAME: string;
  APP_ENV: string;
}) =>
  WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike(),
          winston.format.errors({ stack: true }),
          winston.format.metadata({
            fillExcept: ['message', 'level', 'timestamp', 'label'],
          }),
        ),
      }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
  });
