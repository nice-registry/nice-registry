const Fetcher = require('../fetcher')
const humanInterval = require('human-interval')
const got = require('got')
const objectValues = require('object-values')

module.exports = class Downloads extends Fetcher {
  fetcher (packageName) {
    const start = new Date(new Date() - humanInterval('3 years')).toISOString().substr(0, 10)
    const end = new Date().toISOString().substr(0, 10)
    const url = `https://api.npmjs.org/downloads/range/${start}:${end}/${packageName}`
    return got(url)
      .then(result => {
        const downloads = {downloadsOnDay: {}}
        JSON.parse(result.body).downloads.forEach(d => {
          downloads.downloadsOnDay[d.day] = d.downloads
        })
        const totalDownloads = objectValues(downloads.downloadsOnDay).reduce((a, b) => a + b, 0)
        const totalDays = Object.keys(downloads.downloadsOnDay).length
        downloads.averageDownloadsPerDay = Math.floor(totalDownloads / totalDays)
        return Promise.resolve(downloads)
      })
      .catch(error => Promise.reject(error))
  }

  get cacheTTL () {
    return process.env.NICE_CACHE_TTL_DOWNLOADS || '3 months'
  }
}
