const downloadCounts = require('download-counts')

module.exports = function (pkg) {
  return Promise.resolve(Object.assign(pkg, {
    averageDownloadsPerDay: downloadCounts[pkg.name] || 0
  }))
}
