const Fetcher = require('../fetcher')
const dependents = require('dependent-packages')

module.exports = class Dependents extends Fetcher {
  fetcher (name) {
    const direct = dependents.directDependents(name)
    const directDev = dependents.directDevDependents(name)
    return Promise.resolve({
      directDependents: direct,
      directDependentsCount: direct.length,
      directDevDependents: directDev,
      directDevDependentsCount: directDev.length,
      totalDirectDependentsCount: direct.length + directDev.length
    })
  }
}
