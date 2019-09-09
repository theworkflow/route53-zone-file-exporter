const fs = require('fs')

module.exports = (zoneFile, { output }) => new Promise((resolve, reject) => {
  const options = { encoding: 'utf8' }

  fs.writeFile(output, zoneFile, options, (err) => {
    if (err) return reject(err)
    resolve()
  })
})
