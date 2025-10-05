// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

async function sendEmail({ to, subject, text, html }) {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html
  };

  const info = await transporter.sendMail(mailOptions);

  // For Ethereal, log preview URL
  if (process.env.NODE_ENV !== 'production') {
    console.log('Message sent:', info.messageId);
    try {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (err) {
      // ignore if not available
    }
  }

  return info;
}

module.exports = sendEmail;
