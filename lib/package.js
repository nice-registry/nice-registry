const Cacheable = require('./cacheable')
const registryUrl = process.env.NICE_CACHE_REGISTRY_URL || require('registry-url')()

module.exports = class Package extends Cacheable {
  fetcher (name) {
    return fetch(`${registryUrl}${name}`)
      .then(resp => Promise.resolve(resp.json()))
      .catch(error => Promise.reject(error))
  }
}
