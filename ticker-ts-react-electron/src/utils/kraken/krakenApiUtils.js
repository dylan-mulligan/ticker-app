const crypto = require('crypto');
const qs = require('querystring');

/**
 * Utility functions for Kraken API authentication and request signing.
 *
 * Exports:
 * - buildNonce: Generates a unique nonce for each request.
 * - buildHeaders: Builds headers with API key and signature for private endpoints.
 * - API_KEY, API_SECRET: Loaded from environment variables.
 */

const API_KEY = process.env.KRAKEN_API_KEY;
const API_SECRET = process.env.KRAKEN_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.error('Error: KRAKEN_API_KEY and/or KRAKEN_API_SECRET are not set in the environment or .env file.');
  process.exit(1);
}

/**
 * Generates a unique nonce for each request.
 * @returns {string} A unique nonce (timestamp in microseconds as string).
 */
function buildNonce() {
  // Returns a unique nonce (timestamp in microseconds as string)
  return (Date.now() * 1000).toString();
}

/**
 * Creates a signature for Kraken API authentication.
 * @param {string} urlPath - The API endpoint path.
 * @param {Object} postBody - The POST body data.
 * @returns {string} The generated API signature.
 */
function buildSignature(urlPath, postBody) {
  // Creates a signature for Kraken API authentication
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

/**
 * Builds headers with API key and signature for private endpoints.
 * @param {string} urlPath - The API endpoint path.
 * @param {Object} postBody - The POST body data.
 * @returns {Object} The headers required for Kraken private API requests.
 */
function buildHeaders(urlPath, postBody) {
  // Returns headers required for Kraken private API requests
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

