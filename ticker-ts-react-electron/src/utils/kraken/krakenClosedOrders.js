require('./loadKrakenEnv');
const axios = require('axios');
const qs = require('querystring');
const { buildNonce, buildHeaders } = require('./krakenApiUtils');

/**
 * Get closed orders from Kraken API.
 *
 * @param {Object} options - Optional parameters (e.g., { trades: true, userref: 123, start: 0, end: 0, ofs: 0, closetime: 'both' })
 * @returns {Promise<void>} Prints the API response or error to the console.
 */
async function getClosedOrders(options = {}) {
  const urlPath = '/0/private/ClosedOrders';
  const apiUrl = `https://api.kraken.com${urlPath}`;
  const nonce = buildNonce();
  const postData = { nonce, ...options };
  const postBody = qs.stringify(postData);
  const headers = buildHeaders(urlPath, postData);

  try {
    // Send POST request to Kraken API for closed orders
    const response = await axios.post(apiUrl, postBody, { headers });
    console.log(response.data);
    console.log('Response Code:', response.status);
  } catch (err) {
    // Log error details
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

module.exports = { getClosedOrders };

