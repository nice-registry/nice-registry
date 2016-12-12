const fs = require('fs')
const path = require('path')
const os = require('os')
const fetch = require('isomorphic-fetch')
const NicePackage = require('nice-package')
const mkdirp = require('mkdirp')
const registryUrl = require('registry-url')()
const cachePath = process.env.NICE_CACHE_PATH || path.join(os.homedir(), '.nice-registry')

module.exports = function getPackageFromDiskOrRegistry (name) {
  const cacheFile = path.join(cachePath, `${name}.json`)

  if (fs.existsSync(cacheFile)) {
    return Promise.resolve(new NicePackage(require(cacheFile)))
  } else {
    return fetch(`${registryUrl}${name}`)
      .then(resp => resp.json())
      .then(pkg => {
        // make a dir for the file to land in, in case it's a @scoped/package
        mkdirp(path.dirname(cacheFile))

        // cache the raw registry response
        fs.writeFileSync(cacheFile, JSON.stringify(pkg, null, 2))

        // return nice Package
        return new NicePackage(pkg)
      })
  }


}
