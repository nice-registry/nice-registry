const Fetcher = require('../fetcher')
const registryUrl = process.env.NICE_REGISTRY_URL || require('registry-url')()
const got = require('got')

module.exports = class Package extends Fetcher {
  fetcher (packageName) {
    return got(`${registryUrl}${packageName}`)
      .then(result => {
        return Promise.resolve(JSON.parse(result.body))
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}
