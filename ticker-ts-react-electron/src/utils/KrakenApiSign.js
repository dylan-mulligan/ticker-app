const crypto = require('crypto');
const qs = require('querystring');

// Use environment variable for API secret
const API_SECRET = process.env.KRAKEN_API_SECRET; // base64-encoded
const urlPath = '/0/private/Balance';
const nonce = Date.now() * 1000; // Kraken expects a big nonce
const postData = {
  nonce: nonce.toString()
};

// Step 1: Encode post data
const postBody = qs.stringify(postData);

// Step 2: SHA256(nonce + POST data)
const hashDigest = crypto.createHash('sha256')
    .update(nonce + postBody)
    .digest();

// Step 3: HMAC-SHA512(path + hashDigest)
const hmac = crypto.createHmac('sha512', Buffer.from(API_SECRET, 'base64'));
const signature = hmac.update(urlPath + hashDigest).digest('base64');

// Output results
console.log('Nonce:', nonce);
console.log('Post Body:', postBody);
console.log('API-Sign:', signature);

