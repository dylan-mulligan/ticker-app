require('./loadKrakenEnv');
const axios = require('axios');
const qs = require('querystring');
const { buildNonce, buildHeaders } = require('./krakenApiUtils');

/**
 * Get order info from Kraken API
 * @param {Object} options - Must include txid (comma delimited string or array of transaction IDs)
 * Example: { txid: 'OXXXXXXXXX,OYYYYYYYYY', trades: true }
 */
async function getOrdersInfo(options = {}) {
  if (!options.txid) {
    console.error('Error: txid parameter is required for getOrdersInfo.');
    return;
  }
  const urlPath = '/0/private/QueryOrders';
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

module.exports = { getOrdersInfo };




