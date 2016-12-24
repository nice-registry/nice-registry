const Fetcher = require('../fetcher')
const humanInterval = require('human-interval')
const got = require('got')
const debug = require('../debug')

module.exports = class Downloads extends Fetcher {
  fetcher (name) {
    const start = new Date(new Date() - humanInterval('3 years')).toISOString().substr(0, 10)
    const end = new Date().toISOString().substr(0, 10)
    const url = `https://api.npmjs.org/downloads/range/${start}:${end}/${name}`
    debug(url)
    return got(url)
      .then(result => {
        const downloads = {onDay: {}}
        JSON.parse(result.body).downloads.forEach(d => {
          downloads.onDay[d.day] = d.downloads
        })
        const totalDownloads = Object.values(downloads.onDay).reduce((a, b) => a + b, 0)
        const totalDays = Object.keys(downloads.onDay).length
        downloads.averagePerDay = Math.floor(totalDownloads / totalDays)
        return Promise.resolve(downloads)
      })
      .catch(error => Promise.reject(error))
  }
}
