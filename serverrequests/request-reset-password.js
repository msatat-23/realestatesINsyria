"use server"
import { generateChangePasswordToken } from "@/data/user/change-password-verification-token";
import { getUserByEmail } from "@/data/user/user";
import { SendResetPasswordEmail } from "@/lib/mail-reset-password";
import prisma from "@/lib/prisma";


export const Reset = async (validatedvalues) => {
    const existingUser = await getUserByEmail(validatedvalues.email);
    if (!existingUser) {
        return { ok: false, error: "EMAIL_NOT_FOUND" };
    }
    const verificationToken = await generateChangePasswordToken(existingUser.email);
    console.log(verificationToken);
    try { const res = await SendResetPasswordEmail(existingUser.email, verificationToken.token); console.log(res); }
    catch (e) { console.log(e); return { ok: false, message: "فشل في إرسال رسالة إعادة ضبط كلمة المرور يرجى المحاولة لاحقا!" }; };
    return { ok: true, success: "SUCCESS" }
}
