const pad = require('pad')
const COLUMN_SIZE = 16

module.exports = function debug () {
  if (!process.env.DEBUG) return

  const args = Array.prototype.slice.call(arguments, 0)
    .map(name => pad(name, COLUMN_SIZE))
    .join(' ')

  console.log(args)
}
