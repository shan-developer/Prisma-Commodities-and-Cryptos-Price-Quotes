import { Controller, Get, Param} from '@nestjs/common';
import { PrismaService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  // @Header('Content-Type', 'application/json')
  async updateAssetQuotes() {
    //return this.prisma.getAssetQuotes('Gold');
    let result = await this.prisma.getAssetQuotes('Gold');
    const updateUser = await this.prisma.pmquotes.update({
      where: {
        pmtype: 'Gold',
      },
      data: {
        quotejson: result,
      },
    })
    return result;
  }

  @Get('getpq/:assetType')
  async getPMQuotes(@Param('assetType') assetType: string) {
    let result = await this.prisma.pmquotes.findUnique({where: {pmtype: assetType},select:{quotejson: true}});
    return result.quotejson;
  }

}
