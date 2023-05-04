import { Module } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CarouselController } from './carousel.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CarouselController],
  providers: [CarouselService, PrismaService]
})
export class CarouselModule {}
