const Fetcher = require('../fetcher')
const dependents = require('dependent-packages')

module.exports = class Dependents extends Fetcher {
  fetcher (packageName) {
    const direct = dependents.directDependents(packageName)
    const directDev = dependents.directDevDependents(packageName)
    return Promise.resolve({
      directDependents: direct,
      directDependentsCount: direct.length,
      directDevDependents: directDev,
      directDevDependentsCount: directDev.length,
      totalDirectDependentsCount: direct.length + directDev.length
    })
  }

  get cacheTTL () {
    return process.env.NICE_CACHE_TTL_DEPENDENTS || '1 month'
  }
}
