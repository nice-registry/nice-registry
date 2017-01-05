// return an array of one or many github tokens

// NICE_GITHUB_ACCESS_TOKEN
// NICE_GITHUB_ACCESS_TOKEN_OTHER
// NICE_GITHUB_ACCESS_TOKEN_ZED

module.exports = function () {
  return Object.keys(process.env)
    .filter(key => key.startsWith('NICE_GITHUB_ACCESS_TOKEN'))
    .map(key => process.env[key])
}
