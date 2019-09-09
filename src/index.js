const getRecordSets = require('../lib/getRecordSets')
const generateZoneFile = require('../lib/generateZoneFile')
const writeFile = require('../lib/writeFile')

module.exports = async (options, awsConfig = {}) => {
  if (!options.zoneId) throw new Error('`options.zoneId` is required')

  const { origin, recordSets } = await getRecordSets(options, awsConfig)
  const zoneFile = generateZoneFile(recordSets, origin, options)

  if (options.output) await writeFile(zoneFile, options)
  return zoneFile
}
