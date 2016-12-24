const Package = require('./package')
const Dependents = require('./dependents')

module.exports = function getFullPackage (name) {
  return Promise.all([
    new Package(name),
    new Dependents(name)
  ]).then(results => {
    const finalPackage = Object.assign(
      {},
      results[0],
      results[1]
    )
    return Promise.resolve(finalPackage)
  })
}
