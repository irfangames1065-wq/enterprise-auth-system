const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const nodemailer = require('nodemailer');

const cleanEnvValue = (value) => String(value ?? '').trim();

const getSmtpConfig = () => {
  const host = cleanEnvValue(process.env.SMTP_HOST);
  const port = Number(cleanEnvValue(process.env.SMTP_PORT || 587));
  const user = cleanEnvValue(process.env.SMTP_USER);
  const pass = cleanEnvValue(process.env.SMTP_PASS);

  return { host, port, user, pass };
};

function isSmtpConfigured() {
  const { host, port, user, pass } = getSmtpConfig();
  const hasRequiredConfig = Boolean(host && user && pass && port);
  const isPlaceholder = [host, user, pass].some((value) => /your-app-password|replace-with|changeme|example|<username>|<password>/i.test(String(value || '')));

  console.log('[SMTP] config check:', {
    host: host || 'missing',
    port: port || 'missing',
    smtpUserExists: Boolean(user),
    smtpPassExists: Boolean(pass),
    fromEmailExists: Boolean(process.env.FROM_EMAIL)
  });

  if (!hasRequiredConfig || isPlaceholder) return false;
  return true;
}

function createTransporter() {
  const { host, port, user, pass } = getSmtpConfig();

  if (!host || !user || !pass || !port) {
    console.warn('[SMTP] SMTP transport not created because required env vars are missing.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

module.exports = {
  isSmtpConfigured,
  createTransporter
};
