import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductObject } from 'src/product/product.object';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticService {
    constructor(private prisma: PrismaService, private userService: UserService) {}

    async getMainStatistic(userId: number) {
        const user = await this.userService.getUser(userId, {
            orders: {
                select: {
                    items: true,
                }
            },
            reviews: true
        });

        return [
            {
                name: "Orders",
                value: user.orders.length,
            },
            {
                name: "Reviews",
                value: user.reviews.length,
            },
            {
                name: "Products",
                value: user.favorites.length,
            },
        ]
    }

    async removeClick(id: number) {
        return this.prisma.click.delete({
            where: {
                id
            },
        })
    }

    async incrementClick(id: number) {
        return this.prisma.click.update({
            where: {
                productId: id,
            },
            data: {
                count: {
                    increment: 1,
                },
            }
        })
    }

    async getTopProducts() {       
        return this.prisma.click.findMany({
            orderBy: {
                count: "desc",
            },
            take: 5,
            include: {
                product: {
                    select: ProductObject
                },
            }
        })
    }

    // Private methods

    async getClicks(id: number) {
        const clicks = await this.prisma.click.findUnique({
            where: {
                productId: id,
            }
        });

        if(!clicks) {
            return this.prisma.click.create({
                data: {
                    productId: id,
                    count: 0,
                }
            })
        }

        return clicks;
    }
}

