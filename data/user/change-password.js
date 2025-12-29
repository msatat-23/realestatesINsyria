import prisma from "@/lib/prisma";
import { auth } from "@/auth";
export const changePassword = async (oldpassword, newpassword) => {
    const session = await auth();
    const authUserId = parseInt(session?.user?.id);
    if (!authUserId) {
        return { ok: false, error: "UNAUTHORIZED" };
    }
    const bcrypt = require("bcryptjs");
    const user = await prisma.user.findUnique({
        where: { id: parseInt(authUserId) },
    });
    const passwordMatch = await bcrypt.compare(oldpassword, user.password);
    if (!passwordMatch) {
        return { ok: false, error: "CREDENTIALS" };
    }
    const hashNewPassword = await bcrypt.hash(newpassword, 10);
    try {
        const changePassword = await prisma.user.update({
            where: { id: parseInt(authUserId) },
            data: { password: hashNewPassword }
        });
        return { ok: true, data: "PASSWORD_CHANGED" };
    }
    catch (e) {
        return { ok: false, error: "SERVER_ERROR" };
    }
};