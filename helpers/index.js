import nodemailer from "nodemailer";
import dotenv from 'dotenv'

dotenv.config()

// Using SMTP
export const kirimEmail = nodemailer.createTransport({   
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})

// USING SENDGRID
// import nodemailerSendgrid from "nodemailer-sendgrid";
// export const kirimEmail = nodemailer.createTransport(
//     nodemailerSendgrid({
//         apiKey: process.env.SENDGRID_API_KEY
//     })
// );
