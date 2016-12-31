const Package = require('./fetchers/package')
const Dependents = require('./fetchers/dependents')
const Downloads = require('./fetchers/downloads')
const Repo = require('./fetchers/repo')
const Contributors = require('./fetchers/contributors')

module.exports = function getFullPackage (name) {
  // First try to find the package in the registry,
  // if that is successful, then fetch the rest of the metadata.
  return new Package(name)
    .catch(error => {
      return Promise.reject({error: error})
    })
    .then(pkg => {
      return Promise.all([
        new Dependents(name),
        new Downloads(name),
        new Repo(name),
        new Contributors(name)
      ]).then(results => {
        const finalPackage = Object.assign(
          pkg,
          results[0],
          results[1],
          results[2],
          results[3]
        )
        return Promise.resolve(finalPackage)
      })
    })
    .catch(error => {
      return Promise.reject({error: error})
    })
}
