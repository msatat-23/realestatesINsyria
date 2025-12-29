"use server"
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user/user";
import { generateVerificationToken } from "@/data/user/verification-token";
import { generateTwoFactorToken, getTwoFactorTokenByToken } from "@/data/user/twofactor-token";
import { sendVerificationEmail } from "@/lib/mail";
import { sendTwoFactorTokenEmail } from "@/lib/mail-twofactor";
import { createTwoFactorConfirmation } from "@/data/user/twofactor-confirmation";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
export const Login = async (validatedfields) => {
    try {
        console.log("VALIDATED_FIELDS : ", validatedfields);
        const existingUser = await getUserByEmail(validatedfields.email);
        const bcrypt = require("bcryptjs");
        const passwordMatch = await bcrypt.compare(validatedfields.password, existingUser.password);
        if (!passwordMatch) { return { ok: false, error: "credentials" } };
        if (!existingUser.emailVerified) {
            const verificationToken = await generateVerificationToken(validatedfields.email);
            console.log(verificationToken);
            await sendVerificationEmail(verificationToken.email, verificationToken.token);
            return { ok: false, error: "verifyEmail" };
        }
        if (existingUser.isTwoFactorEnabled && !validatedfields.code) {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.code);
            return { ok: true, twofactor: true };
        }
        if (existingUser.isTwoFactorEnabled && validatedfields.code) {
            const twoFactorToken = await getTwoFactorTokenByToken(validatedfields.code, validatedfields.email);
            if (!twoFactorToken || (twoFactorToken.code !== validatedfields.code)) {
                return { ok: false, error: "INVALID_2FA" };
            }
            await createTwoFactorConfirmation(existingUser.id);
        }
        const { code, ...fieldsWithOutCode } = validatedfields;

        const res = await signIn("credentials", {
            ...fieldsWithOutCode, redirect: false
        });
        console.log("results: ", res);
        if (!res || res.error) {
            return { ok: false, error: res?.error || "auth_error", details: res }
        }
        return { ok: true, data: res };
    } catch (err) {
        console.error("Login server unexpected error:", err);
        const code = (err && (err.code || err.message)) ? String(err.code || err.message) : String(err);
        return { ok: false, error: code };
    }
}
