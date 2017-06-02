const redis = require('redis');

// Simple redis store that serializes the stored objects in JSON
// Available commands: `get`, `set` and `incr`
// All methods return promises.
class Store {

  constructor() {
    // Creates a redis client instance
    this.client = redis.createClient();
  }

  // Gets an object by its key
  get(key) {
    return new Promise((resolve) => {

      // Execute a redis `get` command
      this.client.get(key, (err, reply) => {
        if (err) {
          console.log(err);
          resolve(null);
        }
        else {

          // Parse the stored JSON encoded object
          let obj = JSON.parse(reply);

          resolve(obj);
        }
      });
    });
  }

  // Sets a record in the store
  set(key, obj) {

    // Stringify the stored object
    const value = JSON.stringify(obj);

    return new Promise((resolve) => {

      // Execute a redis `set` command
      this.client.set(key, value, (err) => {
        if (err) {
          console.log(err);
          resolve(false);
        }
	      else
          resolve(true);
      });
    });
  }

  // Increment a given key
  incr(key) {
    
    return new Promise((resolve) => {

      // Execute a redis `incr` command
      this.client.incr(key, (err, value) => {
        if (err) {
          console.log(err);
          resolve(false);
        }
	      else
          resolve(value);
      });
    });
  }
}

module.exports = Store;
