import { Prisma } from "@prisma/client";
import { CategoryObject } from 'src/category/category.object'
import { ReviewObject } from 'src/review/review.object'
import { CharacteristicsObject } from "./characteristics.object";

export const ProductObject: Prisma.ProductSelect = {
    images: true,
    description: true,
    price: true,
    name: true,
    id: true,
    createdAt: true,
    slug: true,
    category: {
        select: CategoryObject,
    },
    reviews: {
        select: ReviewObject,
    },
}

export const ProductWithCharacteristicsObject: Prisma.ProductSelect = {
    ...ProductObject,
    characteristics: {
        select: CharacteristicsObject,
    },
}