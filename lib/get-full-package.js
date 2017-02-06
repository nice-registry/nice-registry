const Package = require('./fetchers/package')
const Dependents = require('./fetchers/dependents')
const Downloads = require('./fetchers/downloads')
const Owners = require('./fetchers/owners')
// const Repo = require('./fetchers/repo')
// const Contributors = require('./fetchers/contributors')

module.exports = function getFullPackage (name) {
  // First try to find the package in the registry,
  // if that is successful, then fetch the rest of the metadata.
  return new Package(name)
    .catch(error => {
      return Promise.reject({error: error})
    })
    .then(pkg => {
      return Promise.resolve(pkg)
    }
  )
  .then(pkg => {
    return new Dependents(pkg)
  })
  .then(pkg => {
    return new Downloads(pkg)
  })
  .then(pkg => {
    return new Owners(pkg)
  })
  .catch(error => {
    return Promise.reject({error: error})
  })
}
