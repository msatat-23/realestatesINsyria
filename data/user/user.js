import prisma from "@/lib/prisma";
export async function getUserByEmail(email) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        return user;
    } catch {
        return null;
    }
};
export async function getUserById(id) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                image: true,
                firstName: true,
                lastName: true,
                username: true,
                email: true,
                profileImage: true,
                role: true,
                emailVerified: true,
                phone: true,
                subscription: true,
                until: true,
                hidePhone: true,
                hideEmail: true,
                hideFirstAndLast: true,
                createdAt: true,
                updatedAt: true,
                isTwoFactorEnabled: true,
            }
        });
        return user;
    } catch {
        return null;
    }
};
