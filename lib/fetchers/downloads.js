const Fetcher = require('../fetcher')
const downloadCounts = require('download-counts')

module.exports = class Downloads extends Fetcher {
  fetcher (packageName) {
    return Promise.resolve({
      averageDownloadsPerDay: downloadCounts[packageName] || 0
    })
  }

  get cacheTTL () {
    return process.env.NICE_CACHE_TTL_DOWNLOADS || '3 months'
  }
}
