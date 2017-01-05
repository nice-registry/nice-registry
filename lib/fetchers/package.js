const Fetcher = require('../fetcher')
const Owner = require('./owner')
const registryUrl = process.env.NICE_CACHE_REGISTRY_URL || require('registry-url')()
const got = require('got')

module.exports = class Package extends Fetcher {
  fetcher (packageName) {
    return got(`${registryUrl}${packageName}`)
      .then(result => {
        const pkg = JSON.parse(result.body)
        if (!Array.isArray(pkg.maintainers)) pkg.maintainers = []

        return Promise.all(pkg.maintainers.map(maintainer => new Owner(maintainer.name)))
          .then(maintainers => {
            return Promise.resolve(Object.assign({}, pkg, {maintainers: maintainers}))
          })
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }

  get cacheTTL () {
    return process.env.NICE_CACHE_TTL_PACKAGES || '1 week'
  }
}
