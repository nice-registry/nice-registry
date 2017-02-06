const Package = require('./fetchers/package')
const Dependents = require('./fetchers/dependents')
const Downloads = require('./fetchers/downloads')
const Owners = require('./fetchers/owners')

module.exports = function getFullPackage (name) {
  return Package(name)
    .then(Dependents)
    .then(Downloads)
    .then(Owners)
    .catch(error => {
      return Promise.reject({error: error})
    })
}
