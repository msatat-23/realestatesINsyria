import prisma from "@/lib/prisma";
import { auth } from "@/auth";



export const addReviewRating = async (propertyId, rating) => {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return { ok: false, error: "UNAUTHORIZED!!" };
    }
    try {
        const addReview = await prisma.review.upsert({
            where: {
                propertyId_userId: {
                    propertyId: parseInt(propertyId),
                    userId: parseInt(userId)
                }
            },
            update: {
                rating: rating
            },
            create: {
                userId: parseInt(userId),
                propertyId: parseInt(propertyId),
                rating: rating
            }
        });
        return { ok: true, data: JSON.stringify(addReview) };
    } catch (e) {
        console.log(e);
        return { ok: false, error: e.message };
    }
};
export const getUserReviewRating = async (propertyId) => {
    const session = await auth();
    const userId = session?.user?.id;
    try {
        const getReview = await prisma.review.findUnique({
            where: {
                propertyId_userId: {
                    propertyId: parseInt(propertyId),
                    userId: parseInt(userId)
                }
            }
        });
        return { ok: true, data: JSON.stringify(getReview) };
    } catch (e) {
        return { ok: false, error: e.message };
    }
};
export const getPropertyReviews = async (propertyId) => {
    try {
        const getReviews = await prisma.review.findMany({
            where: {
                propertyId: parseInt(propertyId)
            }
        });
        return { ok: true, data: getReviews };
    } catch (e) {
        return { ok: false, error: e.message };
    }
};