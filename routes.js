/*
 * An array of routes that are accessible to the public 
 * These routes do not require authentication
 * @type {string[]}
 */




export const publicRoutes = [
    "/",
    "/search"
];

/*
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /profile
 * @type {string[]}
 */

export const authRoutes = [
    "/login",
    "/signup",
    "/error",
    "/new-verification",
];
/*
* These Routes Are Auth Routes But Allowed To Access When LoggedIN
* Such As /reset-password and /reset-password-form
*/
export const allowedAuthRoutesWhenLoggedIn = [
    "/reset-password",
    "/reset-password-form"
];
/*
 * The prefix for api authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/*
 * The default redirct path after logging in 
 *  @type{string} 
 */

export const DEFAULT_LOGIN_REDIRECT = "/";


/*
 * The route for api register
 * This route is used for register
 * @type {string}
 */


export const ApiRegisterRoute = "/api/register";


/*
 * route prefix that is only accessible by admins 
 * and the prefix is /dashboard
 */

export const AdminDashRoutesPrefix = "/dashboard"