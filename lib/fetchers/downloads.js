const Fetcher = require('../fetcher')
const fetch = require('isomorphic-fetch')
const humanInterval = require('human-interval')
const debug = require('../debug')

module.exports = class Downloads extends Fetcher {
  fetcher (name) {
    const start = new Date(new Date() - humanInterval('1 year')).toISOString().substr(0, 10)
    const end = new Date().toISOString().substr(0, 10)
    const url = `https://api.npmjs.org/downloads/range/${start}:${end}/${name}`
    debug(url)
    return fetch(url)
  }
}
