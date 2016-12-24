const Fetcher = require('../fetcher')
const registryUrl = process.env.NICE_CACHE_REGISTRY_URL || require('registry-url')()
const got = require('got')

module.exports = class Package extends Fetcher {
  fetcher (name) {
    return got(`${registryUrl}${name}`)
      .then(result => Promise.resolve(JSON.parse(result.body)))
      .catch(error => Promise.reject(error))
  }
}
