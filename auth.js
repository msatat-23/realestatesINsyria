import NextAuth from "next-auth"
import { getUserById } from "./data/user/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import authConfig from "./auth.config";
import { getTwoFactorConfirmationByUserId } from "./data/user/twofactor-confirmation";
export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    callbacks: {
        async jwt({ token, user }) {
            if (!token.sub) return token;
            const existingUser = await getUserById(parseInt(token.sub));
            // console.log({ THE_EXISTING_USER: existingUser });
            if (!existingUser) return token;
            token.user = existingUser;
            return token;
        },
        async session({ session, token }) {
            console.log({ sessionToken: token })
            if (token?.user) {
                session.user = token.user;
            }
            return session;
        },
        async signIn({ user, account }) {
            if (account.provider !== "credentials") return true;
            const existingUser = await getUserById(parseInt(user.id));
            if (!existingUser.emailVerified) return false;
            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
                if (!twoFactorConfirmation) return false;
                await prisma.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id }
                });
            }
            return true;
        }
    },
    events: {
        async linkAccount({ user }) {
            const id = parseInt(user.id);
            await prisma.user.update(
                {
                    where: { id: id },
                    data: { emailVerified: new Date() }
                }
            )
        }
    },
    pages: {
        signIn: "/login",
        error: "/error"
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
})  