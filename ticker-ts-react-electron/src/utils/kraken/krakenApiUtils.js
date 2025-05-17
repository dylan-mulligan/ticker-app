const crypto = require('crypto');
const qs = require('querystring');

const API_KEY = process.env.KRAKEN_API_KEY;
const API_SECRET = process.env.KRAKEN_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.error('Error: KRAKEN_API_KEY and/or KRAKEN_API_SECRET are not set in the environment or .env file.');
  process.exit(1);
}

function buildNonce() {
  return (Date.now() * 1000).toString();
}

function buildSignature(urlPath, postBody) {
  const nonce = postBody.nonce;
  const postData = qs.stringify(postBody);
  const hashDigest = crypto.createHash('sha256')
    .update(nonce + postData)
    .digest();
  const hmac = crypto.createHmac('sha512', Buffer.from(API_SECRET, 'base64'));
  const what = Buffer.concat([
    Buffer.from(urlPath),
    hashDigest
  ]);
  return hmac.update(what).digest('base64');
}

function buildHeaders(urlPath, postBody) {
  return {
    'API-Key': API_KEY,
    'API-Sign': buildSignature(urlPath, postBody),
    'Content-Type': 'application/x-www-form-urlencoded'
  };
}

module.exports = {
  buildNonce,
  buildHeaders,
  API_KEY,
  API_SECRET
};

