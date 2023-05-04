import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto } from 'src/dto/category.dto';
import { PrismaService } from 'src/prisma.service';
import { slugify } from 'utils/slugify';
import { CategoryObject } from './category.object';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}

    async getById(id: number) {
        const category = await this.prisma.category.findUnique({
            where: {
                id,
            },
            select: CategoryObject
        });

        if(!category) {
            throw new NotFoundException("Category not found");
        }

        return category;
    }

    async getAll() {
        return this.prisma.category.findMany({
            select: CategoryObject
        });
    }

    async updateCategory(id: number, dto: CategoryDto) {
        const isExists = await this.prisma.category.findUnique({
            where: {
                name: dto.name
            }
        });
        if(isExists) throw new BadRequestException("Category already exists");
        return this.prisma.category.update({
            where: {
                id,
            },
            data: {
                name: dto.name,
                slug: slugify(dto.name),
            }
        })
    }

    async getBySlug(slug: string) {
        const category = await this.prisma.category.findUnique({
            where: {
                slug,
            },
            select: CategoryObject
        });

        if(!category) throw new NotFoundException("Category not found");

        return category;
    }

    async removeCategory(id: number) {
        const category = await this.prisma.category.findUnique({where: {id}});
        if(!category) throw new NotFoundException("Category not found");
        
        return this.prisma.category.delete({
            where: {id}
        });
    }

    async createCategory(dto: CategoryDto) {
        const {name} = dto;
        const isExists = await this.prisma.category.findUnique({where: {name}});
        if(isExists) throw new BadRequestException("Category already exists");
        return this.prisma.category.create({
            data: {
                name,
                slug: slugify(name),
            }
        })
    }
}
