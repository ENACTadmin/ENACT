// routes/mail.js

const express = require('express');
const router = express.Router();
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

// POST endpoint to send an email
router.post('/send', async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: to,                       // List of recipients
    subject: subject,             // Subject line
    text: text                    // Plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

module.exports = router;
