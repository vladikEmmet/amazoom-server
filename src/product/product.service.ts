import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetAllProductDto, ProductSort } from 'src/dto/product/getAllProducts.dto';
import { CharacteristicsDto, ProductDto } from 'src/dto/product/product.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { StatisticService } from 'src/statistic/statistic.service';
import { slugify } from 'utils/slugify';
import { ProductObject, ProductWithCharacteristicsObject } from './product.object';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService, private pagination: PaginationService, private staticstic: StatisticService) {}
    
    async getAll(dto: GetAllProductDto = {}) {
        const {sort, searchTerm} = dto

        const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

        if(sort === ProductSort.LOW_PRICE) prismaSort.push({price: "asc"});
        if(sort === ProductSort.HIGH_PRICE) prismaSort.push({price: "desc"});
        if(sort === ProductSort.NEWEST) prismaSort.push({createdAt: "desc"});
        if(sort === ProductSort.OLDEST) prismaSort.push({createdAt: "asc"});

        const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm ? {
            OR: [
                {
                    category: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        }
                    }
                },
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    }
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: "insensitive",
                    }
                }
            ]
        } : {};

        const {limit, offset} = this.pagination.getPagination(dto);
        const products = await this.prisma.product.findMany({
            where: prismaSearchTermFilter,
            orderBy: prismaSort,
            take: limit,
            skip: offset,
            select: ProductObject,
        });

        return {
            products,
            length: await this.prisma.product.count({
                where: prismaSearchTermFilter,
            })
        }
    }

    async getProduct(id: number) {
        const product = await this.prisma.product.findUnique({
            where: {
                id,
            },
            select: ProductWithCharacteristicsObject,
        });

        if(!product) throw new NotFoundException("Product not found");


        return product;
    }

    async getProductBySlug(slug: string) {
        const product = await this.prisma.product.findUnique({
            where: {
                slug,
            },
            select: ProductWithCharacteristicsObject,
        });

        if(!product) throw new NotFoundException("Product not found");

        await this.staticstic.incrementClick(product.id);

        return product;
    }

    async byCategory(categorySlug: string) {
        const products = await this.prisma.product.findMany({
            where: {
                category: {
                    slug: categorySlug,
                },
            },
            select: ProductObject,
        })

        if(!products) throw new NotFoundException("Products not found");

        return products;
    }

    async getSimilar(id: number) {
        const curProduct = await this.getProduct(id);

        if(!curProduct) throw new NotFoundException("Product not found");

        const products = await this.prisma.product.findMany({
            where: {
                category: {
                    name: curProduct.category.name,
                },
                NOT: {
                    id: curProduct.id,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            select: ProductObject,
        });

        return products;
    }

    async createProduct(dto: ProductDto) {
        const {name, price, description, images, characteristics} = dto;
        const isExists = await this.prisma.product.findUnique({
            where: {name}
        });

        if(isExists) throw new BadRequestException("Product already exists");

        const category = this.prisma.category.findUnique({where: {id: +dto.categoryId}});

        if(!category) throw new NotFoundException("Category not found");
        
        const product = await this.prisma.product.create({
            data: {
                name,
                slug: slugify(name),
                price,
                description,
                images,
                category: {
                    connect: {
                        id: +dto.categoryId,
                    },
                }
            },
        });

        for(let i = 0; i < characteristics.length; i++) {
            const characteristic = characteristics[i];
            this.createCharacteristic(product.id, characteristic);
        }

        return product;
    }

    async updateProduct(id: number, dto: ProductDto) {
        const {description, images, price, name, categoryId, characteristics} = dto;

        console.log(price);
        
        const newProduct = await this.prisma.product.update({
            where: {
                id,
            },
            data: {
                name,
                price,
                description,
                images,
                slug: slugify(name),
                category: {
                    connect: {
                        id: +categoryId,
                    }
                }
            },
        });
        for(let i = 0; i < characteristics.length; i++) {
            const characteristic = characteristics[i];
            if(characteristic.id) {
                await this.prisma.characteristics.update({
                    where: {
                        id: characteristic.id,
                    },
                    data: {
                        name: characteristic.name,
                        value: characteristic.value,
                    }
                });
            } else {
                await this.createCharacteristic(newProduct.id, characteristic);
            }
        }
    }

    async createCharacteristic(id: number, dto: CharacteristicsDto) {
        const {name, value} = dto;
        return this.prisma.characteristics.create({
            data: {
                name,
                value,
                productId: id
            }
        });
    }

    async removeProduct(id: number) {
        const product = await this.prisma.product.findUnique({
            where: {
                id,
            }
        });

        if(!product) throw new NotFoundException("Product not found");

        return this.prisma.product.delete({
            where: {
                id,
            }
        })
    }
}
