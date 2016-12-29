const Fetcher = require('../fetcher')
const repos = require('all-the-package-repos')
const parseGitHubUrl = require('github-url-to-object')

module.exports = class Repo extends Fetcher {
  fetcher (name) {
    const repoUrl = repos[name]
    if (!repoUrl) {
      this.status(`noRepo`)
      return Promise.resolve(null)
    }

    const repoObject = parseGitHubUrl(repoUrl)
    if (!repoObject) {
      this.status(`noGithubRepo`)
      return Promise.resolve(null)
    }

    if (!process.env.NICE_GITHUB_ACCESS_TOKEN) {
      this.status(`noGitHubToken`)
      return Promise.resolve(null)
    }

    const Octokat = require('octokat')
    const github = new Octokat({token: process.env.NICE_GITHUB_ACCESS_TOKEN})
    const {user, repo} = repoObject
    return github.repos(user, repo).fetch()
      .then(data => {
        return Promise.resolve({githubRepo: data})
      })
  }

  get cacheTTL () {
    return process.env.NICE_CACHE_TTL_REPOS || '1 week'
  }
}
