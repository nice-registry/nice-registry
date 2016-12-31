const path = require('path')
const fs = require('fs')
const assert = require('assert')
const debug = require('./debug')
const save = require('fs-extra').outputFileSync
const humanInterval = require('human-interval')

/*

This is a generic class with filesystem caching.
Each extending class must define the following:

- a `fetcher` instance method
- a 'cacheTTL' getter method returning a `human-interval` strin

*/

module.exports = class Fetcher {
  constructor (name) {
    this.name = name
    this.type = this.constructor.name.toLowerCase()

    assert(typeof this.fetcher === 'function', `${this.type} must specify a 'fetcher' method`)
    assert(this.cacheTTL, `${this.type} must specify a 'cacheTTL' getter method`)

    return this.fetch()
  }

  fetch () {
    if (this.isCached) {
      if (this.cacheIsExpired) {
        this.status('cacheExpired')
      } else {
        this.status('alreadyCached')
        return Promise.resolve(require(this.cacheFile))
      }
    }

    return this.fetcher(this.name)
      .then(content => {
        if (content) {
          save(this.cacheFile, JSON.stringify(content, null, 2))
          this.status('addedToCache')
        }
        return Promise.resolve(content)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }

  status (message) {
    debug(this.name, this.type, message)
  }

  get cachePath () {
    return process.env.NICE_CACHE_PATH || path.join(process.cwd(), '.cache')
  }

  get cacheFile () {
    return path.join(this.cachePath, this.type, `${this.name}.json`)
  }

  get isCached () {
    return fs.existsSync(this.cacheFile)
  }

  get cacheFileAge () {
    return new Date() - fs.statSync(this.cacheFile).mtime
  }

  get cacheIsExpired () {
    return this.cacheFileAge > humanInterval(this.cacheTTL)
  }
}
