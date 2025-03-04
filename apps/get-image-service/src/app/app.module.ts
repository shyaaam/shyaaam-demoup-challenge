import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicImage } from './entities/public-image.entity';
import { DatabaseModule, RedisModule } from '@scale-hoster/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${__dirname}/.env`,
    }),
    LoggerModule.forRoot(),
    DatabaseModule,
    TypeOrmModule.forFeature([PublicImage]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
