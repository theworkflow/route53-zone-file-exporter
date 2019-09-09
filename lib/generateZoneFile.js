const { ZoneFile } = require('zone-file')

const isAliased = resource => Object.keys(resource)
  .find(key => key === 'AliasTarget')

const getSOARecord = recordSets => {
  const parts = recordSets
    .find(resource => resource.Type === 'SOA')
    .ResourceRecords[0].Value.split(' ')

  return {
    mname: parts[0],
    rname: parts[1],
    serial: parts[2],
    refresh: parts[3],
    retry: parts[4],
    expire: parts[5],
    minimum: parts[6]
  }
}

const getARecords = recordSets => recordSets
  .filter(resource => resource.Type === 'A')
  .reduce((acc, resource) => {
    if (isAliased(resource)) {
      acc.push({ name: resource.Name, ip: resource.AliasTarget.DNSName })
    } else {
      resource.ResourceRecords.forEach(e => {
        acc.push({ name: resource.Name, ip: e.Value })
      })
    }

    return acc
  }, [])

const getMXRecords = recordSets => recordSets
  .filter(resource => resource.Type === 'MX')
  .reduce((acc, resource) => {
    resource.ResourceRecords.forEach(e => {
      const [preference, host] = e.Value.split(' ')
      acc.push({ ttl: resource.TTL, host, name: resource.Name, preference })
    })

    return acc
  }, [])

const getNSRecords = recordSets => recordSets
  .filter(resource => resource.Type === 'NS')
  .reduce((acc, resource) => {
    resource.ResourceRecords.forEach(e => {
      acc.push({ name: resource.Name, ttl: resource.TTL, host: e.Value })
    })

    return acc
  }, [])

const getTXTRecords = recordSets => recordSets
  .filter(resource => resource.Type === 'TXT')
  .reduce((acc, resource) => {
    resource.ResourceRecords.forEach(e => {
      acc.push({ name: resource.Name, txt: e.Value, ttl: resource.TTL })
    })

    return acc
  }, [])

const getCNAMERecords = recordSets => recordSets
  .filter(resource => resource.Type === 'CNAME')
  .reduce((acc, resource) => {
    if (isAliased(resource)) {
      acc.push({ name: resource.Name, alias: resource.AliasTarget.DNSName })
    } else {
      resource.ResourceRecords.forEach(entry => {
        acc.push({ name: resource.Name, alias: entry.Value })
      })
    }

    return acc
  }, [])

const formatZoneData = (recordSets, origin, options) => ({
  $origin: origin,
  $ttl: options.ttl,
  a: getARecords(recordSets),
  ns: getNSRecords(recordSets),
  soa: getSOARecord(recordSets),
  mx: getMXRecords(recordSets),
  txt: getTXTRecords(recordSets),
  cname: getCNAMERecords(recordSets)
})

module.exports = (recordSets, origin, options) => {
  options.ttl = options.ttl || 3600

  const zoneData = formatZoneData(recordSets, origin, options)
  const zonefile = new ZoneFile(zoneData)

  return zonefile.toString()
}
