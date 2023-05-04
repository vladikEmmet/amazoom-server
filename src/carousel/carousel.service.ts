import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CarouselDto } from 'src/dto/carousel.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CarouselService {
    constructor(private readonly prisma: PrismaService) {}

    async getCarousel(name: string) {
        return this.prisma.carousel.findUnique({
            where: { name },
            include: { items: true },
        });
    }

    async updateCarousel(dto: CarouselDto) {
        const carousel = await this.prisma.carousel.findUnique({where: {name: dto.name}});

        if(!carousel) throw new NotFoundException("Carousel not found")
        
        return this.prisma.carousel.update({
            where: { name: dto.name || "main" },
            data: {
                items: {
                    create: dto.items
                },
                name: dto.name
            },
        });
    }

    async createCarousel(dto: CarouselDto) {
        const isExists = await this.prisma.carousel.findUnique({where: {name: dto.name}})

        if(isExists) throw new BadRequestException("Carousel already exists")
        
        return this.prisma.carousel.create({
            data: {
                items: {
                    create: dto.items
                },
                name: dto.name
            },
        });
    }

    async getAll() {
        return this.prisma.carousel.findMany();
    }
}
