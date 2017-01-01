#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2))
const server = require('./server')
const action = argv._[0]

switch (action) {
  case 'serve':
  case 'server':
    const port = Number(argv.port || argv.p || process.env.PORT || 3000)
    server.listen(port, function () {
      console.log(`listening on localhost:${port}`)
    })
    break
  default:
    usage()
}

function usage () {
  console.log(`
Usage:

nice-registry server --port=3001
`)
  process.exit()
}
