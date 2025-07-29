import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // or specify 'smtp.mailgun.org' for Mailgun, etc.
    auth: {
        user: process.env.SMTP_USER, // your SMTP email
        pass: process.env.SMTP_PASS, // your SMTP password
    },
});

export const sendVerificationEmail = async (userEmail: string, token: string) => {
    const verificationLink = `https://nyirendas.co.tz/verify-email?token=${token}`;

    await transporter.sendMail({
        from: 'nyirendascompany@gmail.com', 
        to: userEmail,
        subject: 'Verify Your Email',
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });
};
