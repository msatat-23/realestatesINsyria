import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const updateuser = async (data) => {
    const session = await auth();
    const id = parseInt(session?.user?.id);
    if (!id) return "بحاجة إلى تسجيل الدخول";

    const dataToUpdate = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        phone: data.phone
    };

    try {
        const update = await prisma.user.update({
            where: { id: parseInt(id) },
            data: dataToUpdate
        });
        return { ok: true, data: JSON.stringify(update) };
    } catch (e) {
        return { ok: false, error: e };
    }
};
export const changePrivacySettings = async (privacy) => {
    const session = await auth();
    const id = parseInt(session?.user?.id);
    try {
        const changeprivacy = await prisma.user.update({
            where: { id },
            data: { ...privacy }
        });
        return { ok: true, data: changeprivacy };
    }
    catch (e) {
        return { ok: false, error: e };
    }
};
export const fetchPrivacySettings = async () => {
    const session = await auth();
    const id = parseInt(session?.user?.id);
    try {
        const privacysettings = await prisma.user.findUnique({
            where: { id },
            select: {
                hidePhone: true,
                hideEmail: true,
                hideFirstAndLast: true,
                isTwoFactorEnabled: true
            }
        });
        return { ok: true, data: privacysettings };
    }
    catch (e) {
        return { ok: false, error: e };
    }
};
export const updateUserImage = async (secure_url, public_id) => {
    const session = await auth();
    const id = parseInt(session?.user?.id);
    try {
        const updateimage = await prisma.user.update({
            where: { id },
            data: {
                image: secure_url,
                image_public_id: public_id
            }
        });
        return { res: true, data: updateimage };
    }
    catch (e) {
        return { res: false, error: e };
    }
};
export const deleteUser = async () => {
    const session = await auth();
    const id = parseInt(session?.user?.id);
    try {
        const deleteUser = await prisma.user.delete({
            where: {
                id: parseInt(id)
            }
        });
        return { ok: true, data: deleteUser };
    } catch (e) {
        console.log(e);
        return { ok: false, error: e.message }
    }
};
export const setTwoStepVerification = async (active) => {
    const session = await auth();
    const id = parseInt(session?.user?.id);
    try {
        const setTwoStep = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                isTwoFactorEnabled: active
            }
        });
        return { ok: true, data: setTwoStep };
    } catch (e) {
        console.log(e);
        return { ok: false, error: e.message }
    }
};