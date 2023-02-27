import nodemailer from "nodemailer";

//Using SMTP
export const kirimEmail = nodemailer.createTransport({   
    host: 'smtp.mailgun.org',
        port: 587,
        secure: false, // true for 465, false for other ports
    auth: {
        user: '',
        pass: ''
    }
})