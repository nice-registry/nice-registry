const Fetcher = require('../fetcher')
const npmUser = require('npm-user')
const gravatarUrl = require('gravatar-url')

module.exports = class Owner extends Fetcher {
  fetcher (name) {
    return npmUser(name)
      .then(profile => {
        const opts = {
          size: 200,
          default: 'https://cldup.com/FIjisumbxl.png'
        }
        profile.gravatar = gravatarUrl(profile.email, opts)
        return Promise.resolve(profile)
      })
  }

  get cacheTTL () {
    return process.env.NICE_CACHE_TTL_OWNERS || '1 year'
  }
}
