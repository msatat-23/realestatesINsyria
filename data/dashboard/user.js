import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const updateUserPropertyState = async (propertyId, state) => {
    const session = await auth();
    const role = session?.user?.role;
    if (role === "USER") return { ok: false, error: "UNAUTHORIZED" };
    if (!["ACCEPTED", "REJECTED", "PENDING"].includes(state)) {
        return { ok: false, error: "INVALID" };
    }
    try {
        const update = await prisma.property.update({
            where: { id: parseInt(propertyId) },
            data: { state: state }
        });
        return { ok: true, data: update.state };
    } catch (e) {
        return { ok: false, error: e };
    }
};
export const updateUserRole = async (userId, newRole) => {
    const session = await auth();
    const role = session?.user?.role;
    if (role === "USER") return { ok: false, error: "UNAUTHORIZED" };
    if (!["USER", "ADMIN", "SUPERADMIN"].includes(newRole)) return { ok: false, error: "INVALID ROLE PASSED" };
    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { role: true }
    });
    if (!user || user.role === "SUPERADMIN") return { ok: false, error: "UNAUTHORIZED" };
    if (role === user.role || (role === "ADMIN" && (user.role === "SUPERADMIN" || newRole === "SUPERADMIN"))) {
        return { ok: false, error: "UNAUTHORIZED" };
    }
    try {
        const updateRole = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { role: newRole },
            select: { role: true }
        });
        return { ok: true, data: updateRole };
    } catch (e) {
        return { ok: false, error: e };
    }
};
export const deleteUser = async (userId) => {
    const session = await auth();
    const role = session?.user?.role;
    if (role === "USER") return { ok: false, error: "UNAUTHORIZED" };
    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { role: true }
    });
    if (!user || user.role === "SUPERADMIN") return { ok: false, error: "UNAUTHORIZED" };
    if (role === user.role || (role === "ADMIN" && user.role === "SUPERADMIN")) {
        return { ok: false, error: "UNAUTHORIZED" };
    }
    try {
        const deletedUser = await prisma.user.delete({
            where: { id: parseInt(userId) },
            select: { id: true }
        });
        return { ok: true, data: deletedUser };
    } catch (e) {
        return { ok: false, error: e };
    }
};