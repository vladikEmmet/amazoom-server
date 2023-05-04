import { Injectable } from '@nestjs/common';
import { OrderDto } from 'src/dto/order.dto';
import { PrismaService } from 'src/prisma.service';
import { ProductObject } from 'src/product/product.object';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    async getAll(userId: number) {
        return this.prisma.order.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: ProductObject,
                        }
                    }
                }
            }
        })
    }

    async placeOrder(dto: OrderDto, userId: number) {
        const order = await this.prisma.order.create({
            data: {
                status: dto.status,
                items: {
                    create: dto.items,
                },
                user: {
                    connect: {
                        id: userId,
                    }
                },
            }
        });

        return order;
    }

    
    
}
