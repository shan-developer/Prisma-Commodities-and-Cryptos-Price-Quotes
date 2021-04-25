import { Controller, Get, Param, Inject } from '@nestjs/common';
import { PrismaService } from './app.service';
import { Cron } from '@nestjs/schedule';
import fetch from 'node-fetch';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) { }

  @Get()
  // @Header('Content-Type', 'application/json')
  returnNoRoute() {
    return "No Route.";
  }

  @Get('updateQuotes')
  async updateAssetQuotes() {
    //return this.prisma.getAssetQuotes('Gold');
    var result: any;
    result = await this.prisma.getAssetQuotes('Gold');
    await this.prisma.pmquotes.update({
      where: {
        pmtype: 'Gold',
      },
      data: {
        quotejson: result,
      },
    })

    result = await this.prisma.getAssetQuotes('Silver');
    await this.prisma.pmquotes.update({
      where: {
        pmtype: 'Silver',
      },
      data: {
        quotejson: result,
      },
    })

    console.log('updateAssetQuotes executed.')
    return result;
  }

  @Get('getpq/:assetType')
  async getPMQuotes(@Param('assetType') assetType: string) {
    let result = await this.prisma.pmquotes.findUnique({ where: { pmtype: assetType }, select: { quotejson: true } });
    return result.quotejson;
  }

  @Cron('0 */15 * * * *')
  // @Cron('45 * * * * *')
  handleCron() {
    fetch('https://prisma-quotes.herokuapp.com/updateQuotes').then(function (response) {
    // fetch('http://localhost:3000/updateQuotes').then(function (response) {
        // The API call was successful!
      return response.text();
    }).then(function (html) {
      console.log(html)
    }).catch(function (err) {
      // There was an error
      console.warn('Cannot invoke updateQuotes', err);
    })
  }
}
