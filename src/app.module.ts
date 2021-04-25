import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [PrismaService],
})

export class AppModule {}
