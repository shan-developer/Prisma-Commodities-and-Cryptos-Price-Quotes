import { Controller, Get, Param, Header } from '@nestjs/common';
import { PrismaService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  async getHello() {
    //return this.prisma.getAssetQuotes('Gold');
    return await this.prisma.getAssetQuotes('Gold');
  }

  @Get('getpq/:assetType')
  async user(@Param('assetType') assetType: string) {
    return await this.prisma.pmquotes.findUnique({where: {pmtype: assetType}});
  }

}
