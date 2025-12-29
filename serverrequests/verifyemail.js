"use server"
import { getVerificationTokenByToken } from "@/data/user/verification-token";
import { getUserByEmail } from "@/data/user/user";
import prisma from "@/lib/prisma";

export const VerifyEmail = async (token) => {
    let error = "حدث شيئ خاطئ!";
    const DB_token = await getVerificationTokenByToken(token);
    console.log(DB_token);
    const user = await getUserByEmail(DB_token.email);
    if (!DB_token || !user) {
        return { ok: false, error: error };
    }
    else if (new Date(DB_token.expires) < new Date()) {
        return { ok: false, error: "TOKEN_EXPIRED" }
    }
    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: new Date(),
            email: DB_token.email
        }
    });
    await prisma.verificationToken.delete({
        where: { id: DB_token.id }
    });
    return { ok: true, success: "EMAIL_VERIFIED" };
}