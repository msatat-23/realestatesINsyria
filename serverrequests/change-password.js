"use server"
import { getChangePasswordVerificationTokenByToken } from "@/data/user/change-password-verification-token";
import { getUserByEmail } from "@/data/user/user";
import prisma from "@/lib/prisma";

export const ChangePassword = async (newpassword, token) => {
    const verificationToken = await getChangePasswordVerificationTokenByToken(token);
    if (!verificationToken) {
        return { ok: false, error: "TOKEN_INVALID" };
    }
    const user = await getUserByEmail(verificationToken.email);
    if (!user) {
        return { ok: false, error: "TOKEN_INVALID" };
    }
    console.log({ verificationToken, user });

    if (new Date(verificationToken.expires) < new Date()) {
        return { ok: false, error: "TOKEN_EXPIRED" };
    }
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    console.log(hashedPassword);
    try {
        const res = await prisma.user.update({
            where: { email: user.email },
            data: { password: hashedPassword }
        });
        if (!res || res.error) {
            return { ok: false, error: res?.error || "UPDATE_PASSWORD_FAILED_FROM_SERVER" }
        }
        return { ok: true, date: res };
    } catch (e) {
        console.log(e);
        return { ok: false, error: "UPDATE_PASSWORD_FAILED_FROM_SERVER" };
    }
}
