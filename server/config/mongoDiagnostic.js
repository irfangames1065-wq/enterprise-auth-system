const dns = require('dns').promises;
const net = require('net');
const tls = require('tls');

const timeout = 10000;

const withTimeout = (promise, label) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${timeout}ms`)), timeout))
]);

const testTcp = (host, port) => withTimeout(new Promise((resolve, reject) => {
  const socket = net.createConnection({ host, port });
  socket.once('connect', () => {
    socket.destroy();
    resolve({ ok: true });
  });
  socket.once('error', (error) => {
    socket.destroy();
    reject(error);
  });
}), 'TCP connectivity');

const testTls = (host, port) => withTimeout(new Promise((resolve, reject) => {
  const socket = tls.connect({ host, port, servername: host, rejectUnauthorized: true });
  socket.once('secureConnect', () => {
    const authorized = socket.authorized;
    const authorizationError = socket.authorizationError;
    socket.destroy();
    if (!authorized) {
      reject(new Error(authorizationError || 'TLS certificate was not authorized'));
      return;
    }
    resolve({ ok: true, protocol: socket.getProtocol() });
  });
  socket.once('error', (error) => {
    socket.destroy();
    reject(error);
  });
}), 'TLS handshake');

const runMongoDiagnostic = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required.');
  }

  const parsedUri = new URL(mongoUri);
  const srvName = `_mongodb._tcp.${parsedUri.hostname}`;
  console.log(`MongoDB diagnostic for ${parsedUri.hostname}`);

  let records;
  try {
    records = await dns.resolveSrv(srvName);
    console.log(`DNS SRV: PASS (${records.length} records)`);
  } catch (error) {
    console.error(`DNS SRV: FAIL (${error.code || error.message})`);
    return false;
  }

  let allPassed = true;
  for (const record of records) {
    const host = record.name.replace(/\.$/, '');
    const port = record.port;
    let addresses = [];

    try {
      addresses = await dns.resolve4(host);
      console.log(`DNS A ${host}: PASS (${addresses.join(', ')})`);
    } catch (error) {
      allPassed = false;
      console.error(`DNS A ${host}: FAIL (${error.code || error.message})`);
    }

    try {
      await testTcp(host, port);
      console.log(`TCP ${host}:${port}: PASS`);
    } catch (error) {
      allPassed = false;
      console.error(`TCP ${host}:${port}: FAIL (${error.code || error.message})`);
    }

    try {
      const result = await testTls(host, port);
      console.log(`TLS ${host}:${port}: PASS (${result.protocol})`);
    } catch (error) {
      allPassed = false;
      console.error(`TLS ${host}:${port}: FAIL (${error.code || error.message})`);
    }
  }

  return allPassed;
};

module.exports = { runMongoDiagnostic };