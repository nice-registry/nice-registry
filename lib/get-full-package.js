const Package = require('./fetchers/package')
const Dependents = require('./fetchers/dependents')
const Downloads = require('./fetchers/downloads')
const Owners = require('./fetchers/owners')

module.exports = function getFullPackage (name) {
  // First try to find the package in the registry,
  // if that is successful, then fetch the rest of the metadata.
  return Package(name)
    .catch(error => {
      return Promise.reject({error: error})
    })
    .then(pkg => {
      return Promise.resolve(pkg)
    }
  )
  .then(Dependents)
  .then(Downloads)
  .then(Owners)
  .catch(error => {
    return Promise.reject({error: error})
  })
}
