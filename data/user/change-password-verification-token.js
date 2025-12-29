import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
export const getChangePasswordVerificationTokenByEmail = async (email) => {
    try {
        const verificationToken = prisma.verificationToken.findFirst({
            where: { email }
        });
        return verificationToken;
    } catch (err) {
        console.log(err);
        return null;
    }
};
export const getChangePasswordVerificationTokenByToken = async (token) => {
    try {
        const verificationToken = prisma.verificationToken.findUnique({
            where: { token }
        });
        return verificationToken;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const generateChangePasswordToken = async (email) => {
    const token = uuidv4();
    const expires = new Date(Date.now() + 3600 * 1000);
    console.log("TOKEN : ", token);
    console.log("EXPIRES : ", expires);
    const existingToken = await getChangePasswordVerificationTokenByEmail(email);
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
}

