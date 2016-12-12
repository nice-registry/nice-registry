const express = require('express')
const {omit, pick} = require('lodash')
const app = express()
const getPackage = require('./lib/get-package')
const port = Number(process.env.PORT) || 3000

app.get('/*', function (req, res) {
  console.log(req.path)
  const packageName = req.path.replace(/^\//, '')

  getPackage(packageName)
    .then(pkg => {

      // pick specific props
      if (req.query.pick) pkg = pick(pkg, req.query.pick.split(','))

      // omit specific props
      if (req.query.omit) pkg = omit(pkg, req.query.omit.split(','))

      res.json(pkg)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

app.listen(port, function () {
  console.log(`listening on localhost:${port}`)
})
