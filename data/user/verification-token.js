import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";


export const getVerificationTokenByEmail = async (email) => {
    try {
        const verificationToken = await prisma.verificationToken.findFirst({
            where: { email },
        });
        return verificationToken;
    } catch (e) {
        console.log("ERROR FOR GET_TOKEN_BY_EMAIL : ", e);
        return null;
    }
};
export const getVerificationTokenByToken = async (token) => {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        });
        return verificationToken;
    } catch {
        return null;
    }
};

export const generateVerificationToken = async (email) => {
    const token = uuidv4();
    const expires = new Date(Date.now() + 3600 * 1000);
    console.log("TOKEN : ", token);
    console.log("EXPIRES : ", expires);
    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
        await prisma.verificationToken.deleteMany({
            where: { email }
        });
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });
    return verificationToken;
};