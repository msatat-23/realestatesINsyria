import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const deletePropertyById = async (id) => {
    const session = await auth();
    const role = session?.user?.role;
    const userId = parseInt(session?.user?.id);
    if (!userId) return "بحاجة الى تسجيل دخول!";

    const property = await prisma.property.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if (!property || (parseInt(property.userId) !== parseInt(userId) && role === "USER")) return "حدث شيئ خاطئ";

    try {
        const deleteproperty = await prisma.property.delete({
            where: { id: parseInt(id) }
        });
        return { ok: true, data: JSON.stringify(deleteproperty) };
    }
    catch (e) {
        console.log("فشل من السيرفر في حذف العقار!!");
        return { ok: false, error: e };
    }
};


export const deleteImageByPublicId = async (public_id) => {
    const session = await auth();
    const userId = parseInt(session?.user?.id);
    if (!userId) return "بحاجة الى تسجيل دخول!";

    const image = await prisma.image.findUnique({
        where: { public_id: public_id }
    });
    if (!image) return "حدث شيئ خاطئ";
    const imagePropertyId = image.propertyId;
    const property = await prisma.property.findUnique({
        where: { id: parseInt(imagePropertyId) }
    });
    if (!property) return "حدث شيئ خاطئ";
    if (parseInt(property.userId) !== parseInt(userId)) return "حدث شيئ خاطئ";

    const deletedimage = await prisma.image.delete({
        where: { public_id }
    });
    return deletedimage;
};

export const deleteVideoByPropertyId = async (id) => {
    const session = await auth();
    const userId = parseInt(session?.user?.id);
    if (!userId) return "بحاجة الى تسجيل دخول!";

    const property = await prisma.property.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if (!property || parseInt(property.userId) !== parseInt(userId)) return "حدث شيئ خاطئ";


    try {
        const property = await prisma.property.update({
            data: {
                video: null,
                video_public_id: null
            }
            , where: { id: parseInt(id) }
        });
        return { ok: true, data: JSON.stringify(property) };
    }
    catch (e) {
        console.log("فشل في حذف الفيديو!", e);
        return { ok: false, error: e };
    }
};