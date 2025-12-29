import prisma from "@/lib/prisma";


export const getTwoFactorConfirmationByUserId = async (userId) => {
    try {
        const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
            where: { userId }
        });
        return twoFactorConfirmation;
    } catch (e) {
        console.log(e);
        return null;
    }
};

export const createTwoFactorConfirmation = async (userId) => {
    try {
        const twoFactorConfirmation = await prisma.twoFactorConfirmation.create({
            data: { userId }
        });
        return twoFactorConfirmation;
    } catch (e) {
        console.log(e);
        return null
    }
}