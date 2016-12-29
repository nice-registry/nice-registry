const Fetcher = require('../fetcher')
const repos = require('all-the-package-repos')
const {pick} = require('lodash')
const parseGitHubUrl = require('github-url-to-object')

module.exports = class Contributors extends Fetcher {
  fetcher (name) {
    const repoUrl = repos[name]
    if (!repoUrl) {
      this.status('noRepo')
      return Promise.resolve(null)
    }

    const repoObject = parseGitHubUrl(repoUrl)
    if (!repoObject) {
      this.status('noGithubRepo')
      return Promise.resolve(null)
    }

    if (!process.env.NICE_GITHUB_ACCESS_TOKEN) {
      this.status('noGithubToken')
      return Promise.resolve(null)
    }

    const Octokat = require('octokat')
    const github = new Octokat({token: process.env.NICE_GITHUB_ACCESS_TOKEN})
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
