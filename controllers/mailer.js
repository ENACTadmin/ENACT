// utils/mailer.js
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your chosen email service
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // Replace with your email address
      pass: process.env.EMAIL_PASS  // Replace with your email password
    }
  });

/**
 * Send an email
 * @param {string} to - The recipient's email address
 * @param {string} subject - The subject of the email
 * @param {string} text - The email content
 * @returns {Promise<void>} Resolves if the email is sent successfully
 */
async function sendMail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  // Send email and return a promise
  await transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
