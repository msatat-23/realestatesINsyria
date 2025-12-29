import prisma from "@/lib/prisma";
import { auth } from "@/auth";
export const fetchSavedPropertiesByUserId = async (userId) => {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) return null;
    try {
        const properties = await prisma.savedProperty.findMany({
            where: { userId: parseInt(id) },
            select: {
                property: {
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
                    }
                }
            }
        });
        return { ok: true, data: JSON.stringify(properties) };
    } catch (e) {
        console.log("خطأ في جلب العقارات المفضلة", e);
        return { ok: false, error: e };
    }
};

export const deleteSavedProperty = async (propertyId) => {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return null;
    try {
        const deletesavedproperty = await prisma.savedProperty.delete({
            where: {
                propertyId_userId: {
                    propertyId: parseInt(propertyId),
                    userId: parseInt(userId)
                }
            }
        });
        return { ok: true, data: JSON.stringify(deletesavedproperty) };
    } catch (e) {
        console.log(e);
        return { ok: false, error: e };
    }
};

export const addPropertyToFavorites = async (propertyId) => {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) return null;
    try {
        const addToFav = await prisma.savedProperty.create({
            data: {
                userId: parseInt(id),
                propertyId: parseInt(propertyId),
            }
        });
        return { ok: true, data: addToFav };
    }
    catch (e) {
        if (e.code === "P2002") {
            return { ok: false, error: "هذا العقار موجود بالفعل في المفضلة", type: "EXISTS" };
        }

        console.log("خطأ في الإضافة إلى المفضلة!!", e);
        return { ok: false, error: e };
    }
};