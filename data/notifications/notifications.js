import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export const getNotifications = async () => {
    const session = await auth();
    const userId = parseInt(session?.user?.id);
    if (!userId) return { ok: false, error: "بحاجة إلى تسجيل دخول!" };
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        return { ok: true, data: notifications };
    } catch (e) {
        return { ok: false, error: e };
    }
};
export const markNotificationRead = async (id) => {
    const session = await auth();
    const userId = parseInt(session?.user?.id);
    if (!userId) return { ok: false, error: "بحاجة إلى تسجيل دخول!" };
    const not = await prisma.notification.findUnique({
        where: { id: parseInt(id) }
    });
    if (!not || parseInt(not.userId) !== userId) {
        return "حدث شيئ خاطئ";
    }
    try {
        const markread = await prisma.notification.update({
            where: { id: parseInt(id) },
            data: { isRead: true }
        });
        return { ok: true, data: markread };
    } catch (e) {
        return { ok: false, error: e };
    }
};
export const markNotificationsRead = async () => {
    const session = await auth();
    const userId = parseInt(session?.user?.id);
    if (!userId) return { ok: false, error: "بحاجة إلى تسجيل دخول!" };
    try {
        const markread = await prisma.notification.updateMany({
            where: { userId },
            data: { isRead: true }
        });
        return { ok: true, data: markread };
    } catch (e) {
        return { ok: false, error: e };
    }
};