require('./loadKrakenEnv');
const axios = require('axios');
const qs = require('querystring');
const { buildNonce, buildHeaders } = require('./krakenApiUtils');

/**
 * Get open orders from Kraken API
 * @param {Object} options - Optional parameters (e.g., { trades: true, userref: 123 })
 */
async function getOpenOrders(options = {}) {
  const urlPath = '/0/private/OpenOrders';
  const apiUrl = `https://api.kraken.com${urlPath}`;
  const nonce = buildNonce();
  const postData = { nonce, ...options };
  const postBody = qs.stringify(postData);
  const headers = buildHeaders(urlPath, postData);

  try {
    const response = await axios.post(apiUrl, postBody, { headers });
    console.log(response.data);
    console.log('Response Code:', response.status);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

module.exports = { getOpenOrders };

