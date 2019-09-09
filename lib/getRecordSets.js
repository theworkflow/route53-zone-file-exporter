const AWS = require('aws-sdk')

const getOrigin = (zoneId, client) => new Promise((resolve, reject) => {
  const params = { Id: zoneId }

  client.getHostedZone(params, (err, data) => {
    if (err) return reject(err)
    resolve(data.Name)
  })
})

const getRecordSets = (zoneId, client) => new Promise((resolve, reject) => {
  const params = { HostedZoneId: zoneId }

  client.listResourceRecordSets(params, (err, data) => {
    if (err) return reject(err)
    resolve(data.ResourceRecordSets)
  })
})

module.exports = async ({ zoneId }, awsConfig) => {
  const client = new AWS.Route53(awsConfig)
  const origin = await getOrigin(zoneId, client)
  const recordSets = await getRecordSets(zoneId, client)

  return { origin, recordSets }
}
