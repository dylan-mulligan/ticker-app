require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const crypto = require('crypto');
const axios = require('axios');
const qs = require('querystring');

const API_KEY = process.env.KRAKEN_API_KEY;
const API_SECRET = process.env.KRAKEN_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.error('Error: KRAKEN_API_KEY and/or KRAKEN_API_SECRET are not set in the environment or .env file.');
  process.exit(1);
}

async function getTradeBalance(asset = 'ZUSD') {
  const urlPath = '/0/private/TradeBalance';
  const apiUrl = `https://api.kraken.com${urlPath}`;
  const nonce = Date.now() * 1000;

  const postData = { nonce: nonce.toString(), asset }; // asset is optional, default ZUSD
  const postBody = qs.stringify(postData);

  // Step 1: SHA256(nonce + POST data)
  const hashDigest = crypto.createHash('sha256')
    .update(nonce + postBody)
    .digest();

  // Step 2: HMAC-SHA512(path + hashDigest)
  const hmac = crypto.createHmac('sha512', Buffer.from(API_SECRET, 'base64'));
  const what = Buffer.concat([
    Buffer.from(urlPath),
    hashDigest
  ]);
  const signature = hmac.update(what).digest('base64');

  const headers = {
    'API-Key': API_KEY,
    'API-Sign': signature,
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  try {
    const response = await axios.post(apiUrl, postBody, { headers });
    console.log(response.data);
    console.log('Response Code:', response.status);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

getTradeBalance();

