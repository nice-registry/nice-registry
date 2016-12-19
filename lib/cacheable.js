const os = require('os')
const path = require('path')
const fs = require('fs')
const assert = require('assert')
const save = require('fs-extra').outputFileSync

module.exports = class Cacheable {
  constructor (name) {
    assert(name)
    this.name = name
    this.type = this.constructor.name.toLowerCase()
    return this.fetch()
  }

  fetch () {
    const cachePath = process.env.NICE_CACHE_PATH || path.join(os.homedir(), '.nice-registry')
    const cacheFile = path.join(cachePath, this.type, `${this.name}.json`)

    if (fs.existsSync(cacheFile)) {
      console.log(`${this.type} already cached: ${this.name}`)
      return Promise.resolve(require(cacheFile))
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
