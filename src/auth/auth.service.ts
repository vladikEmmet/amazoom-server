import { faker } from '@faker-js/faker';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { AuthDto } from 'src/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

    async register(dto: AuthDto) {
        const isExists = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });

        if(isExists) throw new BadRequestException("User already exists");

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: faker.name.firstName(),
                avatarPath: faker.image.avatar(),
                phone: faker.phone.number(),
                password: await hash(dto.password),
                role: dto.role || "USER",
            }
        });

        const tokens = await this.createTokens(user.id);
        return {
            user: this.returnUserFields(user),
            ...tokens
        }
    }

    async refresh(refreshToken: string) {
        const res = await this.jwt.verifyAsync(refreshToken);
        
        if(!res) throw new UnauthorizedException('User is not authorized');
        
        const user = await this.prisma.user.findUnique({
            where: {
                id: res.id,
            }
        });

        if(!user) throw new NotFoundException('User not found');

        const tokens = await this.createTokens(user.id);

        return {
            user: this.returnUserFields(user),
            ...tokens,
        }
    }

    async login(dto: AuthDto) {
        const user = await this.validateUser(dto);
        const tokens = await this.createTokens(user.id);
        return {
            user: this.returnUserFields(user),
            ...tokens,
        }
    }

    // Private methods

    private async createTokens(userId: number) {
        const data = {id: userId};
        const accessToken = this.jwt.sign(data, {
            expiresIn: "30m",
        });

        const refreshToken = this.jwt.sign(data, {
            expiresIn: "30d",
        })

        return {accessToken, refreshToken};
    }

    private returnUserFields(user: User) {
        return {
            id: user.id,
            role: user.role,
            email: user.email,
        }
    }

    private async validateUser(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })

        if(!user) throw new NotFoundException("User not found");

        const isValid = await verify(user.password, dto.password);
        if(!isValid) throw new UnauthorizedException("Invalid password");

        return user;
    }
}
