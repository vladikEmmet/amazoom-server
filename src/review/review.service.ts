import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ReviewDto } from 'src/dto/review.dto';
import { PrismaService } from 'src/prisma.service';
import { ReviewObject } from './review.object';

@Injectable()
export class ReviewService {
    constructor(private readonly prisma: PrismaService) {}

    async getAll() {
        return this.prisma.review.findMany({
            orderBy: {
                createdAt: "desc"
            },
            select: ReviewObject,
        })
    }

    async createReview(userId: number, dto: ReviewDto, productId: number) {
        const product = await this.prisma.product.findUnique({where: {id: productId}});
        if(!product) throw new NotFoundException("Product not found");
        
        return this.prisma.review.create({
            data: {
                ...dto,
                product: {
                    connect: {
                        id: productId,
                    }
                },
                user: {
                    connect: {
                        id: userId,
                    }
                },
            }
        })
    }

    async getAverrageProductRating(productId: number) {
        return this.prisma.review.aggregate({
            where: {
                productId,
            },
            _avg: {
                rating: true,
            }
        }).then(data => data._avg);
    }

    async deleteReview(id: number, userId: number) {
        const review = await this.prisma.review.findUnique({where: {id}});
        if(!review) throw new NotFoundException("Review not found");
        if(review.userId !== userId) {
            const user = await this.prisma.user.findUnique({where: {id: userId}});
            if(user.role !== 'ADMIN') throw new ForbiddenException("Not enough rights");
        }
        
        return this.prisma.review.delete({
            where: {id}
        });
    }
}
