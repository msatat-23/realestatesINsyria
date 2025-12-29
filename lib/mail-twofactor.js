import { transporter } from "./mailer-transporter";

export const sendTwoFactorTokenEmail = async (email, code) => {
        await transporter.sendMail({
                from: `"realestatesINsyria" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: "TWO FACTOR AUTHENTICATION CODE",
                html: `<p>Your Two Factor Confirmaiton Code is ${code}. Do Not Share This With Any One.</p>`
        })
};



////////////////////RESEND___CODE///////////////////////
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendTwoFactorTokenEmail = async (email, code) => {
//         await resend.emails.send({
//                 from: "Acme <onboarding@resend.dev>",
//                 to: email,
//                 subject: "2FA Code",
//                 html: `<p>Your Two Factor Confirmaiton Code is ${code}. Do Not Share This With Any One.</p>`
//         })
// };
////////////////////RESEND___CODE///////////////////////