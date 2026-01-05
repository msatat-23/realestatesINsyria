import prisma from "@/lib/prisma";
import { auth } from "@/auth";
export async function POST(request) {
    const session = await auth();
    const role = session?.user?.role;
    if (!role || role !== "SUPERADMIN") {
        return new Response(JSON.stringify({ error: "UNAUTHORIZED" }), {
            status: 403,
            headers: { "Content-Type": "application/json" }
        });
    };
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
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                username: body.username,
                phone: body.phone,
                email: body.email,
                password: body.password,
                role: body.role,
                emailVerified: new Date()
            }
        });
        console.log(response);
        return new Response(JSON.stringify({ ok: true, data: { username: response.username } }), {
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