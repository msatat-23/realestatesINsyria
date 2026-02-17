// app/actions/serverLogout.js
"use server";
import { signOut } from "@/auth";
export async function logout() {

    try {
        const logout = await signOut();
        console.log(logout)
    } catch (e) {
        console.log(e);
    }

    return { ok: true };
}
