import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global() // Makes this module available throughout the application without needing to import it again in every module
@Module({
  imports: [
    // Import the ConfigModule to provide environment variables (or any config)
    ConfigModule,
    // Dynamically configure TypeORM using ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // Set your database type and connection options here. For example:
        type: 'postgres',
        host: configService.get<string>('DB_HOST') ?? 'localhost',
        port: configService.get<number>('DB_PORT') ?? 5432,
        username: configService.get<string>('DB_USERNAME') ?? 'scale',
        password: configService.get<string>('DB_PASSWORD') ?? 'scale',
        database: configService.get<string>('DB_DATABASE') ?? 'scale',
        // Glob pattern for entities: adjust as needed to match your Nx workspace structure
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        // Use synchronize: true only in development; disable it in production
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
      }),
    }),
  ],
  // Export TypeOrmModule so that any module importing DatabaseModule has access to the database connection
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
