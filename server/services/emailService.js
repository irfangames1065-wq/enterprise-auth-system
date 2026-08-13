const { createTransporter, isSmtpConfigured } = require('../config/nodemailer');
const { welcomeTemplate, otpTemplate, passwordResetTemplate } = require('../utils/emailTemplates');

const TARGET_EMAIL = process.env.TO_EMAIL || 'irfangames1065@gmail.com';

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  const from = process.env.FROM_EMAIL || TARGET_EMAIL;
  const recipient = to || TARGET_EMAIL;

  if (!transporter) {
    console.log(`[DEV EMAIL SIMULATION] To: ${recipient} | Subject: ${subject}`);
    return {
      demoMode: true,
      to: recipient,
      subject,
      timestamp: new Date().toISOString()
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Nexus Security" <${from}>`,
      to: recipient,
      subject,
      text: text || 'Please check your HTML email client.',
      html
    });
    console.log(`✉️ Real Email Dispatched! Message ID: ${info.messageId}`);
    return { demoMode: false, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Nodemailer error:', error.message);
    return { demoMode: true, error: error.message };
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
