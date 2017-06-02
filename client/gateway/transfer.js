// Wrapper for `iota.api.sendTransfer()`. Returns a promise.
module.exports = (options) => {

  // get an iota instance
  const api = options.api;

  // Array of transfer objects
  const transfer = [{
    'address': options.address,
    'value': parseInt(options.value),
    'message': '',
    'tag': options.tag
  }];

  const seed = options.seed;

  // Depth for the tip selection
  const depth = 4;

  // On mainnet minWeightMagnitude is 18
  const minWeightMagnitude = 18;

  // Return a promise that resolves once the provider responds
  return new Promise((resolve) => {
    options.api.sendTransfer(seed, depth, minWeightMagnitude, transfer, (err, tx) => {
      if (err) {
        console.log('Transfer failed:', err);
        // Resolve null on error
        resolve(null);
      }
      else if (tx.length === 0) {
        resolve(null);
      }
      else {
        // Return the transaction object
        resolve(tx);
      }
    });
  });
};
