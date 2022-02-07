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
    //return this.prisma.getAssetQuotes('Gold');//
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

    result = await this.prisma.getAssetQuotes('CrudeOil');
    await this.prisma.commoditiesothers.update({
      where: {
        commoditytype: 'CrudeOil',
      },
      data: {
        quotejson: result,
      },
    })

    result = await this.prisma.getAssetQuotes('USD');
    await this.prisma.commoditiesothers.update({
      where: {
        commoditytype: 'USD',
      },
      data: {
        quotejson: result,
      },
    })

    result = await this.prisma.getAssetQuotes('BitCoin');
    await this.prisma.commoditiesothers.update({
      where: {
        commoditytype: 'BitCoin',
      },
      data: {
        quotejson: result,
      },
    })

    result = await this.prisma.getAssetQuotes('Eth');
    await this.prisma.commoditiesothers.update({
      where: {
        commoditytype: 'Eth',
      },
      data: {
        quotejson: result,
      },
    })

    result = await this.prisma.getAssetQuotes('Ada');
    await this.prisma.commoditiesothers.update({
      where: {
        commoditytype: 'Ada',
      },
      data: {
        quotejson: result,
      },
    })

    result = await this.prisma.getAssetQuotes('Dot');
    await this.prisma.commoditiesothers.update({
      where: {
        commoditytype: 'Dot',
      },
      data: {
        quotejson: result,
      },
    })

    result = await this.prisma.getAssetQuotes('Lnk');
    await this.prisma.commoditiesothers.update({
      where: {
        commoditytype: 'Lnk',
      },
      data: {
        quotejson: result,
      },
    })

    result = await this.prisma.getAssetQuotes('Vet');
    await this.prisma.commoditiesothers.update({
      where: {
        commoditytype: 'Vet',
      },
      data: {
        quotejson: result,
      },
    })

    result = await this.prisma.getAssetQuotes('Sol');
    await this.prisma.commoditiesothers.update({
      where: {
        commoditytype: 'Sol',
      },
      data: {
        quotejson: result,
      },
    })

    result = await this.prisma.getAssetQuotes('Ava');
    await this.prisma.commoditiesothers.update({
      where: {
        commoditytype: 'Ava',
      },
      data: {
        quotejson: result,
      },
    })

    result = await this.prisma.getAssetQuotes('Ura');
    await this.prisma.commoditiesothers.update({
      where: {
        commoditytype: 'Ura',
      },
      data: {
        quotejson: result,
      },
    })
/*
    result = await this.prisma.getAssetQuotes('Sus');
    await this.prisma.commoditiesothers.update({
      where: {
        commoditytype: 'Sus',
      },
      data: {
        quotejson: result,
      },
    })
*/
    result = await this.prisma.getAssetQuotes('Alg');
    await this.prisma.commoditiesothers.update({
      where: {
        commoditytype: 'Alg',
      },
      data: {
        quotejson: result,
      },
    })
    // console.log('updateAssetQuotes executed.')
    return result;
  }

  @Get('getpq/:assetType')
  async getPMQuotes(@Param('assetType') assetType: string) {
    var result: any;
    if (assetType == 'Gold' || assetType == 'Silver') {
      result = await this.prisma.pmquotes.findUnique({ where: { pmtype: assetType }, select: { quotejson: true } });
    } else {
      result = await this.prisma.commoditiesothers.findUnique({ where: { commoditytype: assetType }, select: { quotejson: true } });
    }
    return result.quotejson;
  }

  @Get('testpq/:assetType')
  async testCommdQuotes(@Param('assetType') assetType: string) {
    var result: any;
    result = await this.prisma.getAssetQuotes(assetType);
    return result;
  }

  @Cron('0 */15 * * * *')
  // @Cron('45 * * * * *')
  
  handleCron() {
    fetch('https://prisma-quotes.herokuapp.com/updateQuotes').then(function (response) {
      // fetch('http://localhost:3000/updateQuotes').then(function (response) {
      // The API call was successful!
      //console.info('UPDATE Quotes triggered!');
      return response.text();
    }).then(function (html) {
      // console.log(html)
    }).catch(function (err) {
      // There was an error
      console.warn('Cannot invoke updateQuotes', err);
    })
  }
  
}
