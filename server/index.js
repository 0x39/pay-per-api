const express = require('express');
const Store   = require('./store');
const IOTA    = require('iota.lib.js');
const crypto  = require('crypto');

// Create an express app
const app = express();

// Set Access control headers
app.use('*', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Authorization, Transaction');
  res.set('Access-Control-Expose-Headers', 'Address, Price, Tag');
  next();
});

// Create a new redis store with `get`, `set` and `incr` commands
const store = new Store();

// Create an IOTA instance
const iota = new IOTA({
  'provider': 'http://localhost:14265'
});

// Generates a new address and keeps track of the `index` in the redis store
async function getAddress(seed) {

  // Increment the index and get the incremented value
  const i = await store.incr('index');

  return new Promise((resolve) => {
    iota.api.getNewAddress(seed, {index: i}, (err, address) => {
      if (err)
        resolve(null);
      else
        resolve(address);
    });
  });
}

// Generates a 27 Trytes random `tag`
function generateTag() {
  const tag = [];
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
  let length = 27;
  while (length > 0) {
    let bytes;
    while (true) {
      try {
        bytes = crypto.randomBytes(Math.ceil(length * 256 / 243));
        break;
      }
      catch(err) {
        continue;
      }
    }
    for (let i = 0; i < bytes.length && length > 0; i++) {
      const byte = bytes.readUInt8(i);
      if (byte < 243) {
        tag.push(charset.charAt(byte % 27));
        length--;
      }
    }
  }
  return tag.join('');
}

/**
 *   Helper function that creates a `contract` with servers address, the price
 *   per request and a unique random `tag` that proves the owner of the API key.
 *   It also records the contract in the store.
 */
async function createContract(APIKey, price) {

  const seed = 'QWERTY9';

  // Create a new addrress
  const address = await getAddress(seed);

  // Create a tag
  const tag = generateTag();

  // Create a contract object
  const contract = {
    'address': address,
    'tag': tag,
    'price': price
  }

  // Store the credentials in relation to the API key
  await store.set(APIKey, contract);

  // Returns the new address, tag and price
  return contract;
}


/**
 *   Helper function that checks the validity of the bundle against
 *   a stored contract that consists of the servers `address`, the `price`
 *   for the paid request and a random unique `tag`.
 */
async function checkBundle(APIKey, hash, contract) {

  // Stop here if contract is null
  if (! contract)
    return false;

  // Get the bundle from the trasnaction
  const bundle = await new Promise((resolve) => {

    // Get the transaction bundle
    iota.api.getBundle(hash, (err, bundle) => {
      if (err)
        resolve(null);
      else
        resolve(bundle);
    });
  });

  // Return false if the bundle was not found
  if (! bundle)
    return false;

  // Extract transaction object from the bundle
  const tx = iota.valid.isArray(bundle[0]) ? bundle[0][0] : bundle[0];

  // Return false if the extracted address is irrelevant
  if (tx.address !== contract.address)
    return false;

  // Return false if the tag is different
  if (tx.tag !== contract.tag)
    return false;

  // Return false if the funds are insufficient
  if (tx.value < contract.price)
    return false;

  // Return true otherwise
  return true;

}


/**
 *   Setup an initialization API endpoint where everyone can request a new
 *   API key and get started
 *
 *   Returns a response with that API Key in the body and the required headers
 *   for the client to make a transaction. These are the `Address`, `Tag` and
 *   `Price` headers.
 *
 *   A new entry with the address, price and tag is recorded in the store.
 */
app.get('/get_started', async (req, res) => {

  // Create a new API key
  const APIKey = crypto.randomBytes(32).toString('hex');

  // Set the price in IOTAs
  const price = 0;

  // Creates a contract and writes it in the store
  const contract = await createContract(APIKey, price);

  // Write the response headers
  res.set('address', contract.address);
  res.set('tag', contract.tag);
  res.set('price', contract.price);

  // Write the APIKey in the response body
  res.send(APIKey);
});

/**
 *   Listen for paid API requests
 *   It extracts the relevant request headers and checks clients payment.
 *   Clients should provide their API key in the `Authoriazation` header
 *   and the tail transaction hash in the `Transaction` header.
 *
 *   If the client issued a valid transaction a new `address` and `tag` are
 *   being generated and sent back as response headers to be used for
 *   the next paid request.
 */
app.get('/', async (req, res) => {

  // Set the price in IOTAs
  const price = 0;

  // Extract the API key from the request headers
  const APIKey = req.get('Authorization');

  // Retrieve the relevant contract from our redis store
  let contract = await store.get(APIKey);

  // Extract the tail transaction hash from the request headers
  let hash = req.get('Transaction');

  // Check if the provided transaction is valid according to our stored contract
  const paid = await checkBundle(APIKey, hash, contract);

  let msg = '';

  if (!contract) {
    msg = 'Error: API key is invalid!';
  }
  else if (paid) {
    // We can replace this with whatever resource we want
    msg = 'Success!';

    // Update the contract with new address and tag
    contract = await createContract(APIKey, price);
  }
  else {
    msg = 'Error: Payment was not found.';
  }

  // Write the response headers anyway
  res.set('address', contract.address);
  res.set('tag', contract.tag);
  res.set('price', contract.price);

  // Send the response
  res.send(msg);
});


// Listen for requests on the give port
const port = 3030;

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
