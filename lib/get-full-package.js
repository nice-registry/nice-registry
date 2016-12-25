const Package = require('./fetchers/package')
const Dependents = require('./fetchers/dependents')
const Downloads = require('./fetchers/downloads')
const Repo = require('./fetchers/repo')
const Contributors = require('./fetchers/contributors')

module.exports = function getFullPackage (name) {
  return Promise.all([
    new Package(name),
    new Dependents(name),
    new Downloads(name),
    new Repo(name),
    new Contributors(name)
  ]).then(results => {
    const finalPackage = Object.assign(
      {},
      results[0],
      results[1],
      results[2],
      results[3],
      results[4]
    )
    return Promise.resolve(finalPackage)
  })
}
