const welcomeTemplate = (name) => `
  <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #0f172a; padding: 40px 20px; color: #f8fafc;">
    <div style="max-width: 520px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #818cf8; font-size: 28px; margin: 0;">Nexus Portal</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Enterprise Authentication System</p>
      </div>
      <h2 style="color: #ffffff; font-size: 20px;">Welcome aboard, ${name}! 🎉</h2>
      <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
        Thank you for joining Nexus Auth. Your account is now ready for use. Enjoy secure access, role management, and continuous authentication monitoring.
      </p>
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; color: #64748b; font-size: 12px;">
        © 2026 Nexus Auth System. All rights reserved.
      </div>
    </div>
  </div>
`;

const otpTemplate = (otp, name) => `
  <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #0f172a; padding: 40px 20px; color: #f8fafc;">
    <div style="max-width: 520px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #818cf8; font-size: 28px; margin: 0;">Nexus Portal</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Security Verification Code</p>
      </div>
      <h2 style="color: #ffffff; font-size: 20px;">Hello ${name},</h2>
      <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
        Use the following 6-digit One-Time Password (OTP) to complete your account verification. This code is valid for 10 minutes.
      </p>
      <div style="background: rgba(99, 102, 241, 0.15); border: 1px solid #6366f1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
        <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #a5b4fc;">${otp}</span>
      </div>
      <p style="color: #94a3b8; font-size: 13px;">If you did not request this OTP, please ignore this message.</p>
    </div>
  </div>
`;

const passwordResetTemplate = (resetUrl, name) => `
  <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #0f172a; padding: 40px 20px; color: #f8fafc;">
    <div style="max-width: 520px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #818cf8; font-size: 28px; margin: 0;">Nexus Portal</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Password Reset Request</p>
      </div>
      <h2 style="color: #ffffff; font-size: 20px;">Password Reset Instructions</h2>
      <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
        Hello ${name}, we received a request to reset your password. Click the button below to set a new password for your account.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background: linear-gradient(135deg, #6366f1, #a855f7); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #94a3b8; font-size: 13px;">Link expires in 15 minutes. If you did not request a password reset, no action is needed.</p>
    </div>
  </div>
`;

module.exports = {
  welcomeTemplate,
  otpTemplate,
  passwordResetTemplate
};
