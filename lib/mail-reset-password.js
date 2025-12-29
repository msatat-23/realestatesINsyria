import { transporter } from "./mailer-transporter";

export const SendResetPasswordEmail = async (email, token) => {
    const confirmLink = `http://localhost:3000/reset-password-form?token=${token}`;
    await transporter.sendMail({
        from: `"realestatesINsyria" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "RESET YOUR PASSWORD",
        html: `<p>Click<a href="${confirmLink}">  here  </a>to Change Your Password.</p>`
    })
};



////////////////////RESEND___CODE///////////////////////
// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY);
// export const SendResetPasswordEmail = async (email, token) => {
//     const confirmLink = `http://localhost:3000/reset-password-form?token=${token}`;
//     const { data, error } = await resend.emails.send({
//         from: "Acme <onboarding@resend.dev>",
//         to: email,
//         subject: "Reset Your Password",
//         html: `<p>Click<a href="${confirmLink}">  here  </a>to Change Your Password.</p>`
//     });
//     if (error) {
//         return console.error(error);
//     }
//     console.log(data);
// };
////////////////////RESEND___CODE///////////////////////