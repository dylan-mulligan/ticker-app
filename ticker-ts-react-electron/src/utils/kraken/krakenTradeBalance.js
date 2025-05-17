require('./loadKrakenEnv');
const axios = require('axios');
const qs = require('querystring');
const { buildNonce, buildHeaders } = require('./krakenApiUtils');

/**
 * Get trade balance from Kraken API.
 *
 * @param {string} [asset='ZUSD'] - Asset to get trade balance for (e.g., 'ZUSD', 'XXBT').
 * @returns {Promise<void>} Prints the API response or error to the console.
 */
async function getTradeBalance(asset = 'ZUSD') {
  const urlPath = '/0/private/TradeBalance';
  const apiUrl = `https://api.kraken.com${urlPath}`;
  const nonce = buildNonce();
  const postData = { nonce, asset };
  const postBody = qs.stringify(postData);
  const headers = buildHeaders(urlPath, postData);

  try {
    // Send POST request to Kraken API for trade balance
    const response = await axios.post(apiUrl, postBody, { headers });
    console.log(response.data);
    console.log('Response Code:', response.status);
  } catch (err) {
    // Log error details
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

module.exports = { getTradeBalance };
