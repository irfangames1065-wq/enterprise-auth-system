const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { connectDB } = require('./server/config/db');
const { isSmtpConfigured, createTransporter } = require('./server/config/nodemailer');
const { sendEmail } = require('./server/services/emailService');

const authRoutes = require('./server/routes/authRoutes');
const userRoutes = require('./server/routes/userRoutes');
const adminRoutes = require('./server/routes/adminRoutes');
const { notFound, errorHandler } = require('./server/middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;
const TARGET_EMAIL = process.env.TO_EMAIL || 'irfangames1065@gmail.com';

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static Files Serving (for built client or public root)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.use(express.static(__dirname));

// Health & Config Status APIs
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'MERN Authentication & Mail Engine',
    timestamp: new Date().toISOString(),
    targetEmail: TARGET_EMAIL
  });
});

app.get('/api/config-status', (req, res) => {
  const ready = isSmtpConfigured();
  res.json({
    success: true,
    smtpConfigured: ready,
    targetEmail: TARGET_EMAIL,
    mode: ready ? 'LIVE_SMTP' : 'INTERACTIVE_DEMO',
    message: ready
      ? `Real SMTP is active. Emails will be dispatched to ${TARGET_EMAIL}.`
      : `Demo mode active. Configure 16-character Gmail App Password in .env to send live emails to ${TARGET_EMAIL}.`
  });
});

// Legacy direct send-message endpoint support
app.post('/api/send-message', async (req, res) => {
  const { senderName, senderEmail, subject, message } = req.body || {};
  const trimmedName = String(senderName || '').trim();
  const trimmedEmail = String(senderEmail || '').trim();
  const trimmedSubject = String(subject || '').trim();
  const trimmedMessage = String(message || '').trim();

  if (!trimmedName) {
    return res.status(400).json({ success: false, message: 'Please enter your name.' });
  }

  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid sender email address.' });
  }

  if (!trimmedSubject) {
    return res.status(400).json({ success: false, message: 'Please enter a subject.' });
  }

  if (!trimmedMessage) {
    return res.status(400).json({ success: false, message: 'Please enter a message to send.' });
  }

  const recipientEmail = (process.env.TO_EMAIL || process.env.FROM_EMAIL || TARGET_EMAIL || '').trim();
  const mailSubject = trimmedSubject;
  const timestamp = new Date().toLocaleString();

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h2 style="color: #6366f1; margin-top: 0;">📩 Direct Message Received</h2>
      <div style="background: #ffffff; padding: 16px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>From:</strong> ${trimmedName} (&lt;${trimmedEmail}&gt;)</p>
        <p style="margin: 4px 0;"><strong>Date:</strong> ${timestamp}</p>
        <p style="margin: 4px 0;"><strong>Subject:</strong> ${mailSubject}</p>
      </div>
      <h3 style="color: #334155; margin-bottom: 8px;">Message Content:</h3>
      <div style="background: #ffffff; padding: 16px; border-radius: 8px; font-size: 15px; line-height: 1.6; white-space: pre-wrap; border: 1px solid #e2e8f0;">${trimmedMessage}</div>
    </div>
  `;

  try {
    const result = await sendEmail({
      to: recipientEmail,
      subject: mailSubject,
      html,
      text: trimmedMessage
    });

    return res.status(200).json({
      success: true,
      demoMode: result.demoMode,
      message: result.demoMode
        ? `Message processed! Demo email preview created for ${recipientEmail}.`
        : `Message sent successfully to ${recipientEmail}!`,
      emailPayload: {
        to: recipientEmail,
        from: `${trimmedName} <${trimmedEmail}>`,
        subject: mailSubject,
        content: trimmedMessage,
        timestamp,
        status: result.demoMode ? 'Simulated Dispatch' : 'Live Email Dispatched'
      }
    });
  } catch (error) {
    console.error('[MAIL] send-message failed:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to dispatch email. Please try again later.'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Single Page Application Fallback
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.verify();
      console.log('[SMTP] startup verification successful');
    } catch (error) {
      console.error('[SMTP] Configuration/authentication failed. Check SMTP_USER and SMTP_PASS.');
      console.error('[SMTP] diagnostics:', {
        host: process.env.SMTP_HOST || 'missing',
        port: Number(process.env.SMTP_PORT || 587),
        smtpUserExists: Boolean(process.env.SMTP_USER),
        smtpPassExists: Boolean(process.env.SMTP_PASS)
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📧 Target Recipient Email: ${TARGET_EMAIL}`);
  });
};

startServer().catch((error) => {
  console.error('Server startup failed because MongoDB is unavailable.');
  console.error(error.message);
  process.exitCode = 1;
});
