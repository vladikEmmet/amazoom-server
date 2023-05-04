import { Prisma } from "@prisma/client";
import { userObject } from "src/user/user.object";

export const ReviewObject: Prisma.ReviewSelect = {
    user: {
        select: userObject,
    },
    id: true,
    rating: true,
    text: true,
    createdAt: true,
}