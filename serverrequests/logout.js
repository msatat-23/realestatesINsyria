// app/actions/serverLogout.js
"use server";

import { cookies } from "next/headers";

export async function serverClearSessionCookies() {

    cookies().delete("authjs.session-token");
    cookies().delete("__Secure-authjs.session-token");
    cookies().delete("next-auth.csrf-token"); 

    return { ok: true };
}
