import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
    publicRoutes,
    authRoutes,
    apiAuthPrefix,
    DEFAULT_LOGIN_REDIRECT,
    ApiRegisterRoute,
    allowedAuthRoutesWhenLoggedIn,
    AdminDashRoutesPrefix
} from './routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const role = req.auth?.user?.role;

    const isApiRegisterRoute = ApiRegisterRoute === nextUrl.pathname;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isAllowedAuthRoute = allowedAuthRoutesWhenLoggedIn.includes(nextUrl.pathname);
    const isAdminDashRoute = nextUrl.pathname.startsWith(AdminDashRoutesPrefix);


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
    if ((!isLoggedIn || role === "USER") && isAdminDashRoute) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
});


export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};


export { auth };