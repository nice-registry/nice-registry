const Package = require('./package')
const Dependents = require('./dependents')

module.exports = function getFullPackage (name) {
  return Promise.all([
    new Package(name),
    new Dependents(name)
  ]).then(what => {
    const finalPackage = Object.assign(
      {},
      what[0],
      what[1]
    )
    return Promise.resolve(finalPackage)
  })
}
