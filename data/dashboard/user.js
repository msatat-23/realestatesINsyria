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