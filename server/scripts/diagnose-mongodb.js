const path = require('path');
const dns = require('dns');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { runMongoDiagnostic } = require('../config/mongoDiagnostic');

const dnsServers = process.env.MONGODB_DNS_SERVERS
  ?.split(',')
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers?.length) {
  dns.setServers(dnsServers);
}

runMongoDiagnostic(process.env.MONGODB_URI)
  .then((passed) => {
    process.exitCode = passed ? 0 : 1;
  })
  .catch((error) => {
    console.error(`MongoDB diagnostic failed: ${error.message}`);
    process.exitCode = 1;
  });