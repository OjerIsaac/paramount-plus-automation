import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { envVarsSchema } from './libs/helpers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envVarsSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        ssl:
          config.get('DB_SSL') === 'true'
            ? {
                rejectUnauthorized: config.get('DB_SSL_REJECT_UNAUTHORIZED') !== 'false',
              }
            : false,
        extra: {
          options: '-c timezone=UTC',
        },
      }),
      inject: [ConfigService],
    }),
    {
      ...JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '3h' },
      }),
      global: true,
    },
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
