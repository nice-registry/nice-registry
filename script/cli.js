#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2))
const dedent = require('dedent')
const port = process.env.PORT = Number(argv.port || argv.p || process.env.PORT || 3000)
const action = argv._[0]

switch (action) {
  case 'serve':
  case 'server':
    const server = require('./server')
    server.listen(port, function () {
      console.log(`listening on localhost:${port}`)
    })
    break
  default:
    console.log(dedent`
    \nUsage:

    nice-registry server --port=3001     # starts the server
    `)
    process.exit()
}
