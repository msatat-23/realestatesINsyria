"use client"
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
export const socialLogingHandler = (provider) => {
    console.log(provider);
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
}
