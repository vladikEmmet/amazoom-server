import { Prisma } from "@prisma/client";

export const userObject: Prisma.UserSelect = {
    id: true,
    email: true,
    avatarPath: true,
    password: false,
    phone: true,
    name: true,
}

export const userObjectWithoutPassword: Prisma.UserSelect = {
    password: true,
}