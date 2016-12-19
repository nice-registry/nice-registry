const Cacheable = require('./cacheable')
const dependents = require('dependent-packages')

module.exports = class Dependents extends Cacheable {
  fetcher (name) {
    return Promise.resolve({
      directDependents: dependents.directDependents(name),
      directDevDependents: dependents.directDevDependents(name)
    })
  }
}
