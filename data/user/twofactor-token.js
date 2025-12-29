import prisma from "@/lib/prisma";
import crypto from "crypto";
export async function generateTwoFactorToken(email) {
    const code = crypto.randomInt(100000, 1000000).toString();
    console.log("2FA TOKEN : ", code);
    const expires = new Date(Date.now() + 1000 * 3600);
    const existingToken = await getTwoFactorTokenByEmail(email);
    if (existingToken) {
        await prisma.twoFactorToken.deleteMany({
            where: { id: existingToken.id }
        });
    }
    const twoFactorToken = await prisma.twoFactorToken.create({
        data: {
            email,
            code,
            expires
        },
    });
    return twoFactorToken;

};
export const getTwoFactorTokenByEmail = async (email) => {
    try {
        const token = await prisma.twoFactorToken.findFirst({
            where: { email }
        });
        return token;
    } catch (e) {
        console.log(e);
        return null;
    }
}
export const getTwoFactorTokenByToken = async (code, email) => {
    try {
        const twoFactorToken = await prisma.twoFactorToken.findUnique({
            where: { email_code: { email, code } }
        });
        return twoFactorToken;
    } catch (e) {
        console.log(e);
        return null;
    }
}



