const GithubFetcher = require('./github')

module.exports = class Repo extends GithubFetcher {
  internalGitHubFetcher (packageName, repoObject, github) {
    const {user, repo} = repoObject
    return github.repos(user, repo).fetch()
      .then(data => {
        return Promise.resolve({githubRepo: data})
      })
  }
}
