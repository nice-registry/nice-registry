const profiles = require('owner-profiles')
const ownerStats = require('owners')
const gravatarUrl = require('gravatar-url')
const gravatarOpts = {
  size: 200,
  default: 'https://cldup.com/FIjisumbxl.png'
}

/*
  Note: the npm registry yields an array in the package object
  called `contributors`. This is technically "owners", as in
  `npm owner ls express`.

  This module leaves the array name as `contributors`, and late it
  will be renamed to `owners` when instantiated as a NicePackage
*/

module.exports = function (pkg) {
  const maintainers = (pkg.maintainers || []).map(owner => {
    const profile = profiles.find(owner.name)
    if (!profile) return

    if (profile.email) profile.gravatar = gravatarUrl(profile.email, gravatarOpts)
    profile.packageCount = ownerStats.find(owner => owner.username === profile.username).packageCount

    return profile
  })

  return Promise.resolve(Object.assign(pkg, {
    maintainers: maintainers
  }))
}
