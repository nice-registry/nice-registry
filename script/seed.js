module.exports = function seed () {
  const port = process.env.PORT
  const path = require('path')
  const superagent = require('superagent')
  const requireDir = require('require-dir')
  const packageCacheDir = path.join(process.cwd(), '.cache/package')
  const cachedNames = Object.keys(requireDir(packageCacheDir))
  const uncachedNames = require('all-the-package-names').filter(name => !cachedNames.includes(name))
  const fetch = function () {
    const packageName = uncachedNames.shift()
    const url = `http://localhost:${port}/package/${packageName}`
    superagent.get(url)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          if (err.code === 'ECONNREFUSED') {
            console.error(`\nServer not found! Try this:\n\nnice-registry server -p ${port}\n\n`)
            process.exit()
          } else {
            return console.error(err)
          }
        }
        console.log(packageName)
      })
  }

  console.log(`${cachedNames.length} packages already cached, ${uncachedNames.length} packages remaining.`)
  setInterval(fetch, 500)
}
