import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { CarouselDto } from 'src/dto/carousel.dto';
import { CarouselService } from './carousel.service';

@Controller('carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Get(":name")
  async getCarousel(@Param("name") name: string) {
    return this.carouselService.getCarousel(name);
  }

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put()
  async updateCarousel(@Body() dto: CarouselDto) {
    return this.carouselService.updateCarousel(dto);
  }

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  async createCarousel(@Body() dto: CarouselDto) {
    return this.carouselService.createCarousel(dto);
  }

  @Auth()
  @UsePipes(new ValidationPipe())
  @Get()
  async getAllCarousels() {
    return this.carouselService.getAll();
  }
} 
