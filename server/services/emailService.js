const { createTransporter, isSmtpConfigured } = require('../config/nodemailer');
const { welcomeTemplate, otpTemplate, passwordResetTemplate } = require('../utils/emailTemplates');

const TARGET_EMAIL = process.env.TO_EMAIL || 'example@example.com';

const maskEmail = (email) => {
  if (!email) return 'unknown';
  const [local, domain] = String(email).split('@');
  if (!domain) return 'unknown';
  return `${local.slice(0, 2)}***@${domain}`;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  const from = (process.env.FROM_EMAIL || process.env.SMTP_USER || TARGET_EMAIL || '').trim();
  const recipient = (to || TARGET_EMAIL || '').trim();
  const maskedRecipient = maskEmail(recipient);

  if (!transporter || !isSmtpConfigured()) {
    const message = '[SMTP] No valid SMTP transporter configured. Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and FROM_EMAIL in the environment.';
    console.warn(message);
    console.warn(`[SMTP] Recipient: ${maskedRecipient} | Subject: ${subject}`);
    throw new Error('Failed to dispatch email. Please try again later.');
  }

  try {
    console.log(`[SMTP] Verifying SMTP connection for ${maskedRecipient}...`);
    await transporter.verify();
    console.log('[SMTP] verification successful');

    const info = await transporter.sendMail({
      from: `"Nexus Security" <${from}>`,
      to: recipient,
      subject,
      text: text || 'Please check your HTML email client.',
      html
    });

    console.log(`[SMTP] message sent successfully: ${info.messageId} | recipient=${maskedRecipient}`);
    return { demoMode: false, messageId: info.messageId, recipient };
  } catch (error) {
    console.error('[SMTP] sendMail failed:', {
      code: error.code || 'unknown',
      message: error.message || 'unknown error',
      recipient: maskedRecipient,
      host: process.env.SMTP_HOST || 'missing',
      port: process.env.SMTP_PORT || 'missing',
      smtpUserExists: Boolean(process.env.SMTP_USER),
      smtpPassExists: Boolean(process.env.SMTP_PASS)
    });

    throw new Error('Failed to dispatch email. Please try again later.');
  }
};

const sendWelcomeEmail = async (user) => {
  return await sendEmail({
    to: user.email,
    subject: ' Welcome to Nexus Auth System',
    html: welcomeTemplate(user.name)
  });
};

const sendOtpEmail = async (user, otp) => {
  return await sendEmail({
    to: user.email,
    subject: `🔐 Security OTP Code: ${otp}`,
    html: otpTemplate(otp, user.name)
  });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  return await sendEmail({
    to: user.email,
    subject: '🔑 Password Reset Request',
    html: passwordResetTemplate(resetUrl, user.name)
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOtpEmail,
  sendPasswordResetEmail
};
