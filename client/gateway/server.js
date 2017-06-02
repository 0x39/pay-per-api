const iota = require('./iota');
const transfer = require('./transfer');
const express = require('express');

iota.api.getNodeInfo((err, info) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log(info);
  }
});

// Create an express app instance
const app = express();

// Set Access control headers
app.use('*', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Address, Price, Tag');
  next();
});

const seed = 'ABCDEF9';

// Sends a transfer for the given params and writes the tail transaction hash
app.post('/transfer', async (req, res) => {

  console.log('Sending an IOTA transfer to the servers address...');

  // Send an IOTA transfer with the provided params
  const tx = await transfer({
    'api': iota.api,
    'seed': seed,
    'address': req.get('Address'),
    'value': req.get('Price'),
    'tag': req.get('Tag')
  });

  if (!tx) {
    res.send('Error!');
    return;
  }

  console.log('Transfer sent!');

  let hash = '';

  // Extract the hash of the tail transaction
  if (tx)
    hash = tx[0].hash;

  console.log('Tail transaction hash:', hash)

  // Send the tail transaction hash to the client
  res.send(hash);
});

// Listen for requests on the given port
const port = 3001;

app.listen(port, () => {
  console.log('Gateway listening on port ' + port);
});
