import nodemailer from "nodemailer";


export async function POST(req) {
    const { to, subject, html } = await req.json();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
    await transporter.sendMail({
        from: `"My App" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html
    });

    return Response.json({ success: true });
};