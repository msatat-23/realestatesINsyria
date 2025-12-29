import prisma from "@/lib/prisma";

export const getPropertyDetails = async (id) => {
    const property = await prisma.property.findUnique({
        where: { id: parseInt(id) }
    });
    return property;
};
export const getUserPropertiesByUserId = async (userId) => {
    try {
        const properties = await prisma.property.findMany({
            where: { userId: parseInt(userId) },
            select: {
                id: true,
                title: true,
                description: true,
                purpose: true,
                state: true,
                propertyType: true,
                price: true,
                area: true,
                region: { select: { city: { select: { name: true } }, name: true } },
                subscription: true,
                createdAt: true
            },
        });
        return { ok: true, data: JSON.stringify(properties) };
    } catch (e) {
        console.log("فشل في جلب عقارات المستخدم!!", e);
        return { ok: false, error: e };
    }
};
export const getPropertyFirstImage = async (propertyId) => {
    const image = await prisma.image.findFirst({
        where: { propertyId: parseInt(propertyId) }
    });
    return image;
};
export const getPropertyImages = async (propertyId) => {
    console.log(propertyId)
    const images = await prisma.image.findMany({
        where: { propertyId: parseInt(propertyId) },
        select: { secure_url: true }
    });
    return images;
};
export const getImagePublicIdBySecureUrl = async (secure_url) => {
    const image = await prisma.image.findUnique({
        where: { secure_url },
        select: { public_id: true }
    });
    return image;
}
export const getPropertyAmenities = async (propertyId) => {
    const amenities = await prisma.propertyAmenity.findMany({
        where: { propertyId: parseInt(propertyId) },
        select: {
            propertyId: true,
            amenityId: true,
            description: true,
            amenity: {
                select: { name: true }
            }
        }
    });
    return amenities;
};
export const getVideoSecureUrl = async (id) => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: parseInt(id) },
            select: { video: true }
        });
        return property;
    }
    catch (e) {
        return e;
    }
};
export const getVideoPublicId = async (id) => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: parseInt(id) },
            select: { video_public_id: true }
        });
        return property;
    }
    catch (e) {
        return e;
    }
};
export const increasePropertyViews = async (id) => {
    try {
        const increaseViews = await prisma.property.update(
            {
                where: { id: parseInt(id) },
                data: {
                    views: { increment: 1 }
                },
                select: {
                    views: true
                }
            }
        );
        return { ok: true, data: increaseViews.views }
    } catch (e) {
        console.log(e);
        return { ok: false, error: e.message };
    }
};

