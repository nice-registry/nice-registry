const os = require('os')
const path = require('path')
const fs = require('fs')
const debug = require('./debug')
const save = require('fs-extra').outputFileSync
const CACHE_PATH = process.env.NICE_CACHE_PATH || path.join(os.homedir(), '.nice-registry')
const CACHE_TTL = require('human-interval')(process.env.NICE_CACHE_TTL || '48 hours')
// This is a generic class with filesystem caching
// It is extending by classes like Package, Dependents, and Downloads,
// each of which defines a `fetch` instance method.

module.exports = class Fetcher {
  constructor (name) {
    this.name = name
    this.type = this.constructor.name.toLowerCase()
    return this.fetch()
  }

  get cacheFile () {
    return path.join(CACHE_PATH, this.type, `${this.name}.json`)
  }

  get cacheFileAge () {
    return new Date() - fs.statSync(this.cacheFile).mtime
  }

  get isCached () {
    return fs.existsSync(this.cacheFile)
  }

  get cacheIsExpired () {
    return this.cacheFileAge > CACHE_TTL
  }

  fetch () {
    if (this.isCached) {
      if (this.cacheIsExpired) {
        debug(`${this.type} already cached (but expired): ${this.name}`)
      } else {
        debug(`${this.type} already cached: ${this.name}`)
        return Promise.resolve(require(this.cacheFile))
      }
    }

    return this.fetcher(this.name)
      .then(content => {
        save(this.cacheFile, JSON.stringify(content, null, 2))
        return Promise.resolve(content)
      })
      .catch(error => {
        console.error(error)
        process.exit()
      })
  }
}
