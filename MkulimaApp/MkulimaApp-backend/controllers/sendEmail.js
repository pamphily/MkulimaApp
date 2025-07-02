const nodemailer = require('nodemailer');
require('dotenv').config(); // ✅ Import .env here

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email with subject and message to a recipient
 */
async function sendEmail({ to, subject, html }) {
  const mailOptions = {
    from: `"Mkulima App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to', to);
  } catch (err) {
    console.error('❌ Email failed:', err);
    throw new Error('Failed to send email');
  }
}

module.exports = sendEmail;
