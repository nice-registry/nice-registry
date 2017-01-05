const GithubFetcher = require('./github')
const {pick} = require('lodash')

module.exports = class Contributors extends GithubFetcher {
  internalGitHubFetcher (packageName, repoObject, github) {
    const {user, repo} = repoObject
    return github.repos(user, repo).contributors.fetch({per_page: 100})
      .then(data => {
        const contributors = data.map(contributor => {
          return pick(contributor, ['login', 'avatarUrl', `type`, `contributions`])
        })
        return Promise.resolve({githubContributors: contributors})
      })
  }

  get cacheTTL () {
    return process.env.NICE_CACHE_TTL_CONTRIBUTORS || '1 month'
  }
}
