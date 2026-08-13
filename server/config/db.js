const path = require('path');
const dns = require('dns');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const redactSecrets = (value) => String(value)
  .replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)[^@]+@/gi, '$1<redacted>@')
  .replace(/(password[=:]\s*)[^,\s}]+/gi, '$1<redacted>');

const logMongoError = (error) => {
  const servers = error.reason?.servers;
  const serverSelection = servers
    ? Object.fromEntries([...servers].map(([address, description]) => [address, {
      type: description.type,
      error: redactSecrets(description.error?.message || 'unknown server error')
    }]))
    : undefined;

  console.error('MongoDB connection diagnostic:', {
    name: error.name,
    code: error.code,
    message: redactSecrets(error.message),
    serverSelection
  });

  const message = error.message || '';
  const serverErrors = [...(servers?.values() || [])]
    .map((description) => description.error?.message || '')
    .join(' ');
  const combinedMessage = `${message} ${serverErrors}`;
  let category = 'unknown';

  if (/querySrv|ENOTFOUND|EAI_AGAIN|ECONNREFUSED.*(mongodb|_mongodb)/i.test(combinedMessage)) {
    category = 'DNS';
  } else if (/TLS|SSL|certificate|alert internal error/i.test(combinedMessage)) {
    category = 'TLS handshake';
  } else if (/Authentication failed|bad auth|auth error/i.test(combinedMessage)) {
    category = 'authentication';
  } else if (/ECONNREFUSED|ETIMEDOUT|EHOSTUNREACH|ENETUNREACH/i.test(combinedMessage)) {
    category = 'TCP/network';
  } else if (/whitelist|access list|not authorized/i.test(combinedMessage)) {
    category = 'Atlas IP access';
  }

  console.error(`MongoDB failure category: ${category}`);
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise();
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is required.');
  }

  let parsedUri;
  try {
    parsedUri = new URL(mongoUri);
  } catch {
    throw new Error('MONGODB_URI is not a valid URL.');
  }

  if (parsedUri.protocol !== 'mongodb+srv:' || !parsedUri.hostname || !parsedUri.pathname || !parsedUri.username || !parsedUri.password) {
    throw new Error('MONGODB_URI must be a valid mongodb+srv:// URI with a database name.');
  }

  if (/\s|["']/.test(mongoUri)) {
    throw new Error('MONGODB_URI contains whitespace or quotes.');
  }

  if (/[@:/?#]/.test(parsedUri.password) && !parsedUri.password.includes('%')) {
    throw new Error('MONGODB_URI password contains URI-reserved characters. URL-encode the password in the URI.');
  }

  if (parsedUri.searchParams.get('retryWrites') !== 'true' || parsedUri.searchParams.get('w') !== 'majority') {
    throw new Error('MONGODB_URI must include retryWrites=true and w=majority. Copy the exact Atlas Node.js connection string.');
  }

  const dnsServers = process.env.MONGODB_DNS_SERVERS
    ?.split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers?.length) {
    dns.setServers(dnsServers);
  }

  console.log(`MongoDB hostname: ${parsedUri.hostname}`);

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      tls: true,
      retryWrites: true,
      w: 'majority'
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logMongoError(error);
    throw error;
  }
};

module.exports = { connectDB };
