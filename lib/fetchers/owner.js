const Fetcher = require('../fetcher')
const npmUser = require('npm-user')
const gravatarUrl = require('gravatar-url')

module.exports = class Owners extends Fetcher {
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
}
