const assert = require('assert')
const debug = require('./debug')

/*

This is a generic class with filesystem caching.
Each extending class must define the following:

- a `fetcher` instance method that returns a Promise
  that resolves to a key-value object that will be merged
  into the final package object

*/

module.exports = class Fetcher {
  constructor (name) {
    this.name = name
    this.type = this.constructor.name.toLowerCase()
    assert(typeof this.fetcher === 'function', `${this.type} must specify a 'fetcher' method`)
    return this.fetch()
  }

  fetch () {
    return this.fetcher(this.name)
  }

  status (message) {
    debug(this.name, this.type, message)
  }
}
