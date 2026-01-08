import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export const updateUserSubscription = async (userId, subscription) => {
    const session = await auth();
    const role = session?.user?.role;
    if (!role || role === "USER") return "UNAUTHORIZED";
    try {
        const res = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { subscription: subscription }
        });
        return { ok: true, data: res };
    } catch (e) {
        return { ok: false, error: e };
    }
};

export const setRequestAccepted = async (requestId) => {
    const session = await auth();
    const role = session?.user?.role;
    if (!role || role === "USER") return "UNAUTHORIZED";
    try {
        const res = await prisma.subscriptionRequest.update({
            where: { id: parseInt(requestId) },
            data: { accepted: true }
        });
        return { ok: true, data: res };
    } catch (e) {
        return { ok: false, error: e };
    }
};
export const markReadByAdmin = async (id) => {
    const session = await auth();
    const role = session?.user?.role;
    if (!role || role === "USER") return "UNAUTHORIZED";
    try {
        const res = await prisma.subscriptionRequest.update({
            where: { id: parseInt(id), },
            data: { confirmedByAdmin: true }
        });
        return { ok: true, data: res };
    } catch (e) {
        return { ok: false, error: e };
    }
};