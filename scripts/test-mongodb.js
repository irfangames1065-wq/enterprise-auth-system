const path = require('path');
const dns = require('dns').promises;
const tls = require('tls');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const safeLog = (label, value) => {
  console.log(`${label}: ${value}`);
};

const classifyError = (error) => {
  const msg = String(error.message || error).toLowerCase();

  if (/querysrv|enotfound|eai_again|edns|servfail/.test(msg)) return 'DNS';
  if (/econnrefused|etimedout|ehostunreach|enetunreach|host.*not.*found/.test(msg)) return 'TCP/network';
  if (/ssl|tls|certificate|alert internal error|tlsv1/i.test(msg)) return 'TLS';
  if (/authentication failed|bad auth|auth error|invalid username|not authorized/i.test(msg)) return 'authentication';
  if (/mongodb\+srv|invalid url|invalid uri|protocol/i.test(msg)) return 'URI configuration';
  return 'unknown';
};

const redactedUri = (uri) => uri.replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):[^@]+@/, '$1$2:<redacted>@');

(async () => {
  try {
    safeLog('Node', process.version);
    safeLog('OpenSSL', process.versions.openssl);
    safeLog('Mongoose', mongoose.version);
    safeLog('MongoDB driver', require('mongodb/package.json').version);

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set.');
    }
    safeLog('MONGODB_URI', redactedUri(mongoUri));

    const parsed = new URL(mongoUri);
    if (parsed.protocol !== 'mongodb+srv:') {
      throw new Error('MONGODB_URI is not an Atlas SRV URI.');
    }
    safeLog('Atlas host', parsed.hostname);
    safeLog('Database', parsed.pathname.slice(1));

    const srvName = `_mongodb._tcp.${parsed.hostname}`;
    safeLog('SRV lookup', srvName);
    const srvRecords = await dns.resolveSrv(srvName);
    safeLog('SRV records', srvRecords.map((r) => `${r.name}:${r.port}`).join(', '));

    const hosts = srvRecords.map((r) => r.name.replace(/\.$/, ''));
    for (const host of hosts) {
      const addresses = await dns.resolve4(host);
      safeLog(`A record ${host}`, addresses.join(', '));
      await new Promise((resolve, reject) => {
        const socket = tls.connect({ host, port: 27017, servername: host, rejectUnauthorized: true, timeout: 10000 }, () => {
          safeLog(`TLS ${host}`, `connected, protocol=${socket.getProtocol()}, authorized=${socket.authorized}`);
          socket.destroy();
          resolve();
        });
        socket.on('error', (err) => reject(err));
        socket.on('timeout', () => reject(new Error('TLS connection timed out')));
      });
    }

    safeLog('Attempting mongoose connect', 'start');
    const conn = await mongoose.connect(mongoUri, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });
    safeLog('MongoDB Connected', conn.connection.host);
    await mongoose.disconnect();
  } catch (error) {
    const category = classifyError(error);
    console.error('MongoDB diagnostic error:', error.message);
    console.error('Failure category:', category);
    if (error.stack) {
      console.error(error.stack.split('\n').slice(0, 6).join('\n'));
    }
    process.exit(1);
  }
})();
