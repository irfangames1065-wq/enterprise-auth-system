const nodemailer = require('nodemailer');

function isSmtpConfigured() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return false;
  if (pass === 'your-app-password' || pass === 'your-16-char-app-password') return false;
  return true;
}

function createTransporter() {
  if (!isSmtpConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

module.exports = {
  isSmtpConfigured,
  createTransporter
};
