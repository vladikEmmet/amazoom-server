import { Controller, Get, Param } from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { StatisticService } from './statistic.service';

@Controller('statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Auth()
  @Get("main/:id")
  getMainStatistic(@Param("id") id: string) {
    return this.statisticService.getMainStatistic(+id);
  }

  @Auth()
  @Get("top-products")
  async getTopProducts() {
    return this.statisticService.getTopProducts();
  }
}
