const Fetcher = require('../fetcher')
const repos = require('all-the-package-repos')
const parseGithubUrl = require('github-url-to-object')
const tokens = require('../github-tokens')()

module.exports = class GitHub extends Fetcher {
  fetcher (packageName) {
    const repoUrl = repos[packageName]
    if (!repoUrl) {
      this.status('noRepo')
      return Promise.resolve(null)
    }

    const repoObject = parseGithubUrl(repoUrl)
    if (!repoObject) {
      this.status('noGithubRepo')
      return Promise.resolve(null)
    }

    if (!tokens.length) {
      this.status(`noGitHubToken`)
      return Promise.resolve(null)
    }

    const Octokat = require('octokat')
    const randomToken = tokens[Math.floor(Math.random() * tokens.length)]
    const github = new Octokat({token: randomToken})
    return this.internalGitHubFetcher(packageName, repoObject, github)
  }
}
