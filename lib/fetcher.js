const os = require('os')
const path = require('path')
const fs = require('fs')
const assert = require('assert')
const debug = require('./debug')
const save = require('fs-extra').outputFileSync
const CACHE_PATH = process.env.NICE_CACHE_PATH || path.join(os.homedir(), '.nice-registry')
const CACHE_TTL = require('human-interval')(process.env.NICE_CACHE_TTL || '48 hours')

// This is a generic class with filesystem caching
// It is extending by classes like Package, Dependents, and Downloads,
// each of which defines a `fetch` instance method.

module.exports = class Fetcher {
  constructor (name) {
    assert(name)
    this.name = name
    this.type = this.constructor.name.toLowerCase()
    return this.fetch()
  }

  fetch () {
    const cacheFile = path.join(CACHE_PATH, this.type, `${this.name}.json`)

    if (fs.existsSync(cacheFile)) {
      const cacheFileAge = new Date() - fs.statSync(cacheFile).mtime
      if (cacheFileAge > CACHE_TTL) {
        debug(`${this.type} already cached (but expired): ${this.name}`)
      } else {
        debug(`${this.type} already cached: ${this.name}`)
        return Promise.resolve(require(cacheFile))
      }
    }

    return this.fetcher(this.name)
      .then(content => {
        save(cacheFile, JSON.stringify(content, null, 2))
        return Promise.resolve(content)
      })
      .catch(error => {
        console.error(error)
        process.exit()
      })
  }
}
