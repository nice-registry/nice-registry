const Package = require('./lib/package')
const Dependents = require('./lib/dependents')

modulex.exports = function getFullPackage (name) {
  return Promise.all([
    new Package(name),
    new Dependents(name)
  ]).then(what => {
    const finalPackage = Object.assign(
      {},
      new NicePackage(what[0]),
      what[1]
    )
    return Promise.resolve(finalPackage)
  })
}
