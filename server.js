require('dotenv').load()

const express = require('express')
const app = express()
const getFullPackage = require('./lib/get-full-package')
const port = Number(process.env.PORT) || 3000
const debug = require('./lib/debug')
const NicePackage = require('nice-package')
const allThePackageNames = require('all-the-package-names')

app.get('/packages/find-by-name', (req, res) => {
  res.json(allThePackageNames.filter(name => name.match(req.query.q)))
  // sort names by dependents count
})

app.get('/', (req, res) => {
  return res.redirect('https://github.com/zeke/nice-registry#readme')
})

app.get('/package/:name', (req, res) => {
  getFullPackage(req.params.name)
    .then(pkg => {
      res.json(new NicePackage(pkg, req.query))
    })
    .catch(err => {
      res.status(404).json(err)
    })
})

app.get('/packages', (req, res) => {
  if (!req.query.names) {
    return res.status(40).json({
      error: 'missing required query param: names'
    })
  }

  const names = req.query.names.split(',').map(name => name.trim())

  Promise.all(names.map(name => getFullPackage(name)))
    .then(packages => {
      packages = packages.map(pkg => new NicePackage(pkg, req.query))
      res.json(packages)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

if (!process.parent) {
  app.listen(port, function () {
    debug(`listening on localhost:${port}`)
  })
}

module.exports = app
