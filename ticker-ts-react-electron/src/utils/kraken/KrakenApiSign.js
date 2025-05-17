require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const axios = require('axios');
const qs = require('querystring');
const { buildNonce, buildHeaders } = require('./krakenApiUtils');

async function getAccountBalance() {
  const urlPath = '/0/private/Balance';
  const apiUrl = `https://api.kraken.com${urlPath}`;
  const nonce = buildNonce();
  const postData = { nonce };
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

module.exports = { getAccountBalance };
