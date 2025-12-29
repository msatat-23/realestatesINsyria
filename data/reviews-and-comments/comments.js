import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const addComment = async (propertyId, comment) => {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { ok: false, error: "يجب تسجيل الدخول أولا !" };
    try {
        const newComment = await prisma.comment.create({
            data: {
                userId: parseInt(userId),
                propertyId: parseInt(propertyId),
                comment: comment
            }
        });
        return { ok: true, data: newComment };
    } catch (e) {
        return { ok: false, error: e.message };
    }
};
export const getComments = async (propertyId) => {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                propertyId: parseInt(propertyId)
            },
            select: {
                id: true,
                comment: true,
                createdAt: true,
                user: {
                    select: {
                        username: true,
                        reviews: {
                            where: {
                                propertyId: parseInt(propertyId)
                            },
                            select: {
                                rating: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return { ok: true, data: comments };
    } catch (e) {
        return { ok: false, error: e.message };
    }
};