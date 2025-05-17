require('./loadKrakenEnv');
const axios = require('axios');
const qs = require('querystring');
const { buildNonce, buildHeaders } = require('./krakenApiUtils');

/**
 * Get trade volume from Kraken API.
 *
 * @param {Object} options - Optional parameters for the API call.
 * @param {string} [options.pair] - Comma-separated asset pairs (e.g., 'XXBTZUSD,XXBTZEUR').
 * @param {boolean} [options.fee_info] - Whether to include fee info in the response.
 * @returns {Promise<void>} Prints the API response or error to the console.
 */
async function getTradeVolume(options = {}) {
  const urlPath = '/0/private/TradeVolume';
  const apiUrl = `https://api.kraken.com${urlPath}`;
  const nonce = buildNonce();
  const postData = { nonce, ...options };
  const postBody = qs.stringify(postData);
  const headers = buildHeaders(urlPath, postData);

  try {
    // Send POST request to Kraken API for trade volume
    const response = await axios.post(apiUrl, postBody, { headers });
    console.log(response.data);
    console.log('Response Code:', response.status);
  } catch (err) {
    // Log error details
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

module.exports = { getTradeVolume };

