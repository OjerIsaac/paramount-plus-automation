import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonConfig: winston.LoggerOptions = {
  transports: [
    // Error logs (rotates daily)
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d', // keep logs for 14 days
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),

    // All logs (rotates daily)
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),

    // Console logs (for development)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          ({ timestamp, level, message, ...meta }) =>
            `${timestamp} [${level}] ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta) : ''
            }`
        )
      ),
    }),
  ],
};
