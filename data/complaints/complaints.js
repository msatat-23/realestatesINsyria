import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
    points: 5, //5 TIMES
    duration: 86400 //24 HOURS
});
export const addComplaint = async (data) => {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return "بحاجة إلى تسجيل دخول!!";
    const key = userId ? userId : "anonymous";
    try {
        await rateLimiter.consume(key);
    } catch {
        return { ok: false, error: "لقد تجاوزت الحد المسموح من الطلبات. حاول لاحقًا." };
    }

    const normalizeType = (type) => {
        if (type === "COMPLAINT") return "COMPLAINT";
        else return "INQUIRY";
    };

    const dataToSend = {
        name: data.name,
        email: data.email,
        complaintType: normalizeType(data.complaintType),
        description: data.description,
        propertyId: data.propertyId ? parseInt(data.propertyId) : null
    };

    try {
        if (data.propertyId) {
            const propertyId = Number(data.propertyId);
            if (isNaN(propertyId)) {
                return { ok: false, error: "كود العقار غير صالح" };
            }

            const property = await prisma.property.findUnique({
                where: {
                    id: propertyId
                }
            });
            if (!property) {
                return { ok: false, error: "حدث خطأ يرجى المحاولة لاحقا!!" };
            }
        }
        const res = await prisma.complaint.create({
            data: { ...dataToSend, userId: userId ? userId : null }
        });
        return { ok: true, data: res };
    } catch (e) {
        console.log("failed to add complaint :", e);
        return { ok: false, error: "حدث خطأ يرجى المحاولة لاحقا!!" };
    }
};