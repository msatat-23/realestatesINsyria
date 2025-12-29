import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { validadteEmail } from "./lib/validation/uservalidators";
import { getUserByEmail } from "./data/user/user";

const authConfig = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        Credentials({
            async authorize(credentials) {
                const validateEmail = validadteEmail(credentials.email);
                if (!validateEmail) {
                    const { email, password } = credentials;
                    const user = await getUserByEmail(email);
                    if (!user || !user.password) {
                        return null;
                    }
                    const bcrypt = require("bcryptjs");
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (passwordMatch) return user;
                }
                return null;
            }
        }),

    ],
};

export default authConfig;
