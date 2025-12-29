import { transporter } from "./mailer-transporter";

export const sendVerificationEmail = async (email, token) => {
    const link = `http://localhost:3000/new-verification?token=${token}`;
    await transporter.sendMail({
        from: `"realestatesINsyria" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "CONFIRM YOUR EMAIL",
        html: `<p>Click <a href="${link}">here</a> to verify</p>`,
    });
};




////////////////////RESEND___CODE///////////////////////
// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY);
// export const sendVerificationEmail = async (email, token) => {
//      const confirmLink = `http://localhost:3000/new-verification?token=${token}`;
// const { data, error } = await resend.emails.send({
//     from: "Acme <onboarding@resend.dev>",
//     to: email,
//     subject: "Confirm Your Email",
//     html: `<p>Click<a href="${confirmLink}"> here </a>to confirm email</p>`
// });
// if (error) return console.error({ error });
// console.log({ data });
//};
////////////////////RESEND___CODE///////////////////////