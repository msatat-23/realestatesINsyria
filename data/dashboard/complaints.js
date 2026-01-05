import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const markRead = async (id) => {
    const session = await auth();
    const role = session?.user?.role;

    if (role === "USER") return { ok: false, error: "UNAUTHORIZED" };
    try {
        const res = await prisma.complaint.update({
            where: { id: parseInt(id) },
            data: { readByAdmin: true }
        });
        return { ok: true, data: res };
    } catch (e) {
        return { ok: false, error: e };
    };
};