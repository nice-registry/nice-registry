const os = require('os')
const path = require('path')
const fs = require('fs')
const assert = require('assert')
const save = require('fs-extra').outputFileSync
const CACHE_PATH = process.env.NICE_CACHE_PATH || path.join(os.homedir(), '.nice-registry')
const CACHE_TTL = require('human-interval')(process.env.NICE_CACHE_TTL || '24 hours')

module.exports = class Cacheable {
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
        console.log(`${this.type} already cached (but expired): ${this.name}`)
      } else {
        console.log(`${this.type} already cached: ${this.name}`)
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
