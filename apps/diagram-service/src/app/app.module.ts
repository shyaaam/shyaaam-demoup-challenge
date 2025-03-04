import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiagramController } from './diagram.controller';

@Module({
  imports: [],
  controllers: [AppController, DiagramController],
  providers: [AppService],
})
export class AppModule {}
