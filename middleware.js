import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
    publicRoutes,
    authRoutes,
    apiAuthPrefix,
    DEFAULT_LOGIN_REDIRECT,
    ApiRegisterRoute,
    allowedAuthRoutesWhenLoggedIn
} from './routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiRegisterRoute = ApiRegisterRoute === nextUrl.pathname;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isAllowedAuthRoute = allowedAuthRoutesWhenLoggedIn.includes(nextUrl.pathname);

    if (isApiAuthRoute || isApiRegisterRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }

    if (isAllowedAuthRoute) {
        return null;
    }
    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", nextUrl));
    }

    return null;
});


export const config = {
    matcher: [
        "/((?!_next|.*\\..*|favicon.ico).*)",
        "/(api|trpc)(.*)",
    ],
};


export { auth };