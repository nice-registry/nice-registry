const Cacheable = require('./cacheable')
const registryUrl = process.env.NICE_CACHE_REGISTRY_URL || require('registry-url')()
const fetch = require('isomorphic-fetch')

module.exports = class Package extends Cacheable {
  fetcher (name) {
    return fetch(`${registryUrl}${name}`)
      .then(resp => Promise.resolve(resp.json()))
      .catch(error => Promise.reject(error))
  }
}
