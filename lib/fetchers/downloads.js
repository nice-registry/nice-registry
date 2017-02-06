const Fetcher = require('../fetcher')
const downloadCounts = require('download-counts')

module.exports = class Downloads extends Fetcher {
  fetcher (pkg) {
    return Promise.resolve(Object.assign(pkg, {
      averageDownloadsPerDay: downloadCounts[pkg.name] || 0
    }))
  }
}
