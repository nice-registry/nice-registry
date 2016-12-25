const Fetcher = require('../fetcher')
const debug = require('../debug')
const repos = require('all-the-package-repos')
const parseGitHubUrl = require('github-url-to-object')
const Octokat = require('octokat')
const github = new Octokat({token: process.env.NICE_GITHUB_ACCESS_TOKEN})

module.exports = class Repo extends Fetcher {
  fetcher (name) {
    const repoUrl = repos[name]
    if (!repoUrl) {
      debug(`skipping ${name} repo because package doesn't have a repo`)
      return Promise.resolve(null)
    }

    const repoObject = parseGitHubUrl(repoUrl)
    if (!repoObject) {
      debug(`skipping ${name} repo because it's not a GitHub repo`)
      return Promise.resolve(null)
    }

    if (!process.env.NICE_GITHUB_ACCESS_TOKEN) {
      debug(`skipping ${name} repo because NICE_GITHUB_ACCESS_TOKEN is not set`)
      return Promise.resolve(null)
    }

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
