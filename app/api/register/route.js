import prisma from "@/lib/prisma";
import { generateVerificationToken } from "@/data/user/verification-token";
import { sendVerificationEmail } from "@/lib/mail";
export async function POST(request) {
    const body = await request.json();
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    console.log("entered route");
    try {
        const hashedPass = await bcrypt.hash(body.password, saltRounds);
        body.password = hashedPass;
        const finduserEmail = await prisma.user.findUnique({
            where: { email: body.email }
        });
        const finduserPhone = await prisma.user.findUnique({
            where: { phone: body.phone }
        });
        if (finduserEmail) {
            return new Response(JSON.stringify({ error: "email exists" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            })
        }
        if (finduserPhone) {
            return new Response(JSON.stringify({ error: "phone exists" }), {
                status: 599,
                headers: { "Content-Type": "application/json" }
            })
        }
        console.log("i am in route and about to send sign up request");
        const response = await prisma.user.create({
            data: { ...body }
        });
        console.log(response);
        const verificationToken = await generateVerificationToken(body.email);
        const { Resend } = await import("resend");
        // const resend = new Resend(process.env.RESEND_API_KEY);
        await sendVerificationEmail(body.email, verificationToken.token);

        //await resend.emails.send({
        //     from: "Acme <onboarding@resend.dev>",
        //     to: body.email,
        //     subject: "Confirm Your Email",
        //     html: `<p>Click <a href="http://localhost:3000/new-verification?token=${verificationToken.token}">here</a> to confirm email</p>`
        // });
        return new Response(JSON.stringify(response), {
            headers: { "Content-Type": "application/json" },
            status: 201
        })
    }
    catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ error: err }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
}