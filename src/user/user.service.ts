import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { UserDto } from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma.service';
import { userObject, userObjectWithoutPassword } from './user.object';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUser(id: number, object: Prisma.UserSelect = {}) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                ...userObject,
                favorites: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        images: true,
                        slug: true,
                        category: {
                            select: {
                                slug: true,
                            }
                        },
                        reviews: true,
                    }
                },
                ...object
            }
        });

        if(!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    async updateProfile(id: number, dto: UserDto) {
            const isSameUser = await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                }
            });

            if(isSameUser && isSameUser.id !== id) {
                throw new BadRequestException("User with this email already exists");
            }

            const user = await this.getUser(id);

            const updatedUser = await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    email: dto.email,
                    name: dto.name,
                    phone: dto.phone,
                    avatarPath: dto.avatarPath,
                    password: dto.password ? await hash(dto.password) : user.password,
                },
            })

            return updatedUser;
    }


    async toggleFavorite(userId: number, productId: number) {
        const user = await this.getUser(userId);

        if(!user) throw new NotFoundException("User not found");

        const isExists = user.favorites.some(i => i.id === productId);

        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                favorites: {
                    [isExists ? "disconnect" : "connect"]: {
                        id: productId,
                    }
                }
            }
        })
    }
}
