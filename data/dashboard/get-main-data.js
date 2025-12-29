import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export const getData = async () => {
    const session = await auth();
    const role = session?.user?.role;
    if (role === "USER") return "UNAUTHORIZED";
    const isSuperAdmin = role === "SUPERADMIN";

    const data = await prisma.$transaction([
        prisma.user.count({ where: { role: "USER" } }),
        prisma.user.count({ where: { role: "ADMIN" } }),

    ]);
};