const express = require('express')
const app = express()
const getFullPackage = require('../lib/get-full-package')
const port = Number(process.env.PORT) || 3000
const NicePackage = require('nice-package')
const allThePackageNames = require('all-the-package-names')

app.get('/names', (req, res) => {
  if (!req.query.matching) {
    return res.status(400).json({
      error: 'missing required query param: matching'
    })
  }
  const results = allThePackageNames.filter(name => name.match(req.query.matching))
  res.json(results)
})

app.get('/', (req, res) => {
  return res.redirect('https://github.com/zeke/nice-registry#readme')
})

app.get('/package/:name', (req, res) => {
  getFullPackage(req.params.name)
    .then(pkg => {
      res.json(new NicePackage(pkg, req.query))
    })
    .catch(error => {
      res.status(404).json({
        error: `package not found: ${req.params.name}`,
        message: error
      })
    })
})

app.get('/package/:scope/:name', (req, res) => {
  return res.status(404).json({
    error: 'Sorry, the npm registry does not support scoped packages. Please file an issue at https://github.com/npm/registry'
  })
})

app.get('/packages', (req, res) => {
  if (!req.query.names) {
    return res.status(400).json({
      error: 'missing required query param: names'
    })
  }

  const names = req.query.names.split(',').map(name => name.trim())

  Promise.all(names.map(name => getFullPackage(name)))
    .then(packages => {
      const nicePackages = packages.map(pkg => new NicePackage(pkg, req.query))
      res.json(nicePackages)
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
