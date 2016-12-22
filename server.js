const express = require('express')
const {omit, pick} = require('lodash')
const app = express()
// const Package = require('./lib/package')
const getFullPackage = require('./lib/get-full-package')
const port = Number(process.env.PORT) || 3000



app.get('/*', function (req, res) {
  var names

  if (req.query.packages) {
    // e.g. /?packages=foo,bar,baz
    names = req.query.packages.split(',').map(name => name.trim())
  } else {
    // e.g. /express
    names = [req.path.replace(/^\//, '')]
  }

  Promise.all(names.map(name => getFullPackage(name)))
    .then(packages => {
      packages = packages.map(pkg => {

        // // pick specific props
        // if (req.query.pick) pkg = pick(pkg, req.query.pick.split(','))
        //
        // // omit specific props
        // if (req.query.omit) pkg = omit(pkg, req.query.omit.split(','))

        return pkg
      })

      // one package or an array of packages
      res.json(req.query.packages ? packages : packages[0])
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

if (!process.parent) {
  app.listen(port, function () {
    console.log(`listening on localhost:${port}`)
  })
}

module.exports = app
