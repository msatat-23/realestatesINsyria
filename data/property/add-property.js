import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
    points: 15,
    duration: 86400
});
export const sendBasicData = async (data) => {
    const session = await auth();
    const userId = parseInt(session?.user?.id);
    if (!userId) return "بحاجة الى تسجيل دخول!";

    const key = userId;
    try {
        await rateLimiter.consume(key);
    } catch (keyEror) {
        return { ok: false, error: "لايمكنك إضافة أكثر من 15 عقار خلال 24 ساعة ." };
    }

    const dataToSend = {
        title: data.title,
        description: data.description,
        propertyType: data.propertyType,
        purpose: data.purpose,
        status: data.status,
        regionId: data.regionId,
        street: data.street,
        price: data.price,
        rooms: data.rooms,
        area: data.area,
        floor: data.floor,
        direction: data.direction,
        contactInfo: data.contactInfo,
    };
    try {
        const res = await prisma.property.create({
            data: { ...dataToSend, userId }
        });
        return { ok: true, data: JSON.stringify(res) };
    }
    catch (e) {
        console.log(e);
        return { ok: false, error: e };
    }
};
export const updateBasicData = async (id, data) => {
    const session = await auth();
    const userId = parseInt(session?.user?.id);
    if (!userId) return "بحاجة الى تسجيل دخول!";

    const key = `update:${userId}:${id}`;

    try {
        await rateLimiter.consume(key);
    } catch {
        return { ok: false, error: "لقد عدلت هذا العقار أكثر من اللازم عليك الانتظار ل 24 ساعة لتعديله مرة أخرى أو عليك بإضافة عقار إخر ." };
    }

    const property = await prisma.property.findUnique({ where: { id: parseInt(id) } });
    if (!property || parseInt(property.userId) !== userId) return "حدث خطأ ما الرجاء المحاولة لاحقا";

    const dataToSend = {
        title: data.title,
        description: data.description,
        propertyType: data.propertyType,
        purpose: data.purpose,
        state: "PENDING",
        status: data.status,
        regionId: data.regionId,
        street: data.street,
        price: data.price,
        rooms: data.rooms,
        area: data.area,
        floor: data.floor,
        direction: data.direction,
        contactInfo: data.contactInfo,
    };
    try {
        const property = await prisma.property.findUnique({ where: { id: parseInt(id) } });
        if (!property) {
            return { ok: false, error: "العقار غير موجود!!" };
        }
        const res = await prisma.property.update({
            where: { id: parseInt(id) },
            data: { ...dataToSend, userId }
        });
        return { ok: true, data: JSON.stringify(res) };
    }
    catch (e) {
        console.log(e);
        return { ok: false, error: e };
    }
};
export const sendImages = async (images, propertyId) => {
    const session = await auth();
    const userId = parseInt(session?.user?.id);
    if (!userId) return "بحاجة الى تسجيل دخول!";

    const key = propertyId;

    try {
        await rateLimiter.consume(key);
    } catch {
        return { ok: false, error: "لقد عدلت هذا العقار أكثر من اللازم عليك الانتظار ل 24 ساعة لتعديله مرة أخرى أو عليك بإضافة عقار إخر ." };
    }

    const property = await prisma.property.findUnique({ where: { id: parseInt(propertyId) } });
    if (!property || parseInt(property.userId) !== userId) return "حدث خطأ ما الرجاء المحاولة لاحقا";

    await prisma.property.update({
        where: { id: parseInt(propertyId) },
        data: { state: "PENDING" }
    });
    const results = await Promise.all(
        images.map(async (image) => {
            try {
                const res = await prisma.image.create({
                    data: {
                        propertyId: parseInt(propertyId),
                        public_id: image.public_id,
                        secure_url: image.url
                    }
                });
                return { ok: true, data: res };
            }
            catch (e) {
                console.log("فشل إضافة إحدى الصور إلى قاعدة البيانات!", e);
                return { ok: false, error: e };
            }
        })
    );
    return results;
};
export const sendImage = async (secure_url, public_id, propertyId) => {
    const session = await auth();
    const userId = parseInt(session?.user?.id);
    if (!userId) return "بحاجة الى تسجيل دخول!";

    const key = propertyId;

    try {
        await rateLimiter.consume(key);
    } catch {
        return { ok: false, error: "لقد عدلت هذا العقار أكثر من اللازم عليك الانتظار ل 24 ساعة لتعديله مرة أخرى أو عليك بإضافة عقار إخر ." };
    }

    const property = await prisma.property.findUnique({ where: { id: parseInt(propertyId) } });
    if (!property || parseInt(property.userId) !== userId) return "حدث خطأ ما الرجاء المحاولة لاحقا";

    await prisma.property.update({
        where: { id: parseInt(propertyId) },
        data: { state: "PENDING" }
    });
    try {
        const res = await prisma.image.create({
            data: {
                secure_url,
                public_id,
                propertyId: parseInt(propertyId),
            }
        });
        return { ok: true, data: res };
    }
    catch (e) {
        console.log("فشل إضافة إحدى الصور إلى قاعدة البيانات!", e);
        return { ok: false, error: e };
    }
};
export const sendVideo = async (video_url, video_public_id, propertyId) => {
    const session = await auth();
    const userId = parseInt(session?.user?.id);
    if (!userId) return "بحاجة الى تسجيل دخول!";

    const key = propertyId;

    try {
        await rateLimiter.consume(key);
    } catch {
        return { ok: false, error: "لقد عدلت هذا العقار أكثر من اللازم عليك الانتظار ل 24 ساعة لتعديله مرة أخرى أو عليك بإضافة عقار إخر ." };
    }

    const property = await prisma.property.findUnique({ where: { id: parseInt(propertyId) } });
    if (!property || parseInt(property.userId) !== userId) return "حدث خطأ ما الرجاء المحاولة لاحقا";

    await prisma.property.update({
        where: { id: parseInt(propertyId) },
        data: { state: "PENDING" }
    });
    try {
        const res = await prisma.property.update({
            data: {
                video: video_url,
                video_public_id: video_public_id
            },
            where: { id: parseInt(propertyId) }
        });
        return { ok: true, data: JSON.stringify(res) };
    }
    catch (e) {
        return { ok: false, error: e };
    }
};
export const setAmenities = async (data) => {
    const session = await auth();
    const userId = parseInt(session?.user?.id);
    if (!userId) return "بحاجة الى تسجيل دخول!";

    const key = data[0].propertyId;

    try {
        await rateLimiter.consume(key);
    } catch {
        return { ok: false, error: "لقد عدلت هذا العقار أكثر من اللازم عليك الانتظار ل 24 ساعة لتعديله مرة أخرى أو عليك بإضافة عقار إخر ." };
    }

    const property = await prisma.property.findUnique({ where: { id: parseInt(data[0].propertyId) } });
    if (!property || parseInt(property.userId) !== userId) return "حدث خطأ ما الرجاء المحاولة لاحقا";

    await prisma.property.update({
        where: { id: parseInt(data[0].propertyId) },
        data: { state: "PENDING" }
    });
    try {
        const deleteamenities = await prisma.propertyAmenity.deleteMany({
            where: { propertyId: parseInt(data[0].propertyId) }
        });
        const res = await prisma.propertyAmenity.createMany({
            data: data
        });
        return { ok: true, data: res, deleted: deleteamenities };
    }
    catch (e) {
        console.log('فشل في إضافة المرفقات!!', e);
        return { ok: false, error: e };
    }
};
export const setPropertyCompleted = async (id) => {
    const session = await auth();
    const userId = parseInt(session?.user?.id);
    if (!userId) return "بحاجة الى تسجيل دخول!";


    const property = await prisma.property.findUnique({ where: { id: parseInt(id) } });
    if (!property || parseInt(property.userId) !== userId) return "حدث خطأ ما الرجاء المحاولة لاحقا";

    try {
        const res = await prisma.property.update({
            where: { id: parseInt(id) },
            data: { completed: true }
        });
        return { ok: true, data: JSON.stringify(res) };
    } catch (e) {
        console.log("فشل في ضبط تم الانتهاء من العقار!!", e);
        return { ok: false, error: e };
    }
};
