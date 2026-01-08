import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export const fetchUnreadCountForAdmin = async () => {
    const session = await auth();
    const role = session?.user?.role;
    if (role === "USER") return { ok: false, error: "UNAUTHORIZED" };

    try {
        const count = await prisma.$transaction([
            prisma.user.count({ where: { confirmedByAdmin: false, AND: [{ NOT: { role: "ADMIN" } }, { NOT: { role: "SUPERADMIN" } }], } }),
            prisma.property.count({ where: { state: "PENDING" } }),
            prisma.subscriptionRequest.count({ where: { confirmedByAdmin: false } }),
            prisma.complaint.count({ where: { readByAdmin: false } })
        ]);
        return { ok: true, data: count };
    } catch (e) {
        return { ok: false, error: e };
    }
};