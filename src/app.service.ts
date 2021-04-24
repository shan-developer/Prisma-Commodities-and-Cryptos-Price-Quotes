import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {

  cronCount: number = 0;

  getHello(): string {
    return 'CronCount : ' + this.cronCount.toString();
  }

  @Cron('0 */15 * * * *')
  handleCron() {
    this.cronCount += 1;
  }
}
