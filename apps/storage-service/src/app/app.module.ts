import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicImage } from './entities/public-image.entity';
import { RedisModule } from '@scale-hoster/common';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { databaseConfigFactory } from '@scale-hoster/common';

@Module({
  imports: [
    RedisModule,
    LoggerModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async (logger: PinoLogger) => databaseConfigFactory(logger, __dirname),
      inject: [PinoLogger],
    }),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([PublicImage]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
