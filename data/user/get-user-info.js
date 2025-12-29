import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export const getUserImage = async () => {
    const session = await auth();
    const userId = parseInt(session?.user?.id);
    if (!userId) {
        return { ok: false, error: 'بحاجة الى تسجيل دخول!' };
    }
    const userimage = await prisma.user.findUnique({
        where: { id: userId },

    });
    return { ok: true, data: userimage };
};
export const getAllUserDataForAdmin = async (id) => {
    const session = await auth();
    const role = session?.user?.role;
    if (role === "USER") return "UNAUTHORIZED";

    const user = await prisma.user.findUnique({
        where: { id: parseInt(id) }
    });
    return user;
};

export const getAllUserPropertiesForAdmin = async (id) => {
    const session = await auth();
    const role = session?.user?.role;
    if (role === "USER") return "UNAUTHORIZED";

    const properties = await prisma.property.findMany({
        where: { userId: parseInt(id) },
        include: {
            region: { include: { city: true } },
            images: true
        }
    });
    return JSON.stringify(properties);
};