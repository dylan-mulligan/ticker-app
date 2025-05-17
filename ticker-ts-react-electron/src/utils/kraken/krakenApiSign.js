require('./loadKrakenEnv');
const axios = require('axios');
const qs = require('querystring');
const { buildNonce, buildHeaders } = require('./krakenApiUtils');

/**
 * Get account balance from Kraken API.
 *
 * @returns {Promise<void>} Prints the API response or error to the console.
 */
async function getAccountBalance() {
  const urlPath = '/0/private/Balance';
  const apiUrl = `https://api.kraken.com${urlPath}`;
  const nonce = buildNonce();
  const postData = { nonce };
  const postBody = qs.stringify(postData);
  const headers = buildHeaders(urlPath, postData);

  try {
    // Send POST request to Kraken API for account balance
    const response = await axios.post(apiUrl, postBody, { headers });
    console.log(response.data);
    console.log('Response Code:', response.status);
  } catch (err) {
    // Log error details
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

module.exports = { getAccountBalance };
