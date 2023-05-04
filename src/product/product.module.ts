import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { StatisticService } from 'src/statistic/statistic.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, PaginationService, UserService, StatisticService]
})
export class ProductModule {}
