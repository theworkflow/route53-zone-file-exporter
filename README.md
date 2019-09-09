# route53-zone-file-exporter

[![version](https://img.shields.io/npm/v/route53-zone-file-exporter.svg?style=flat-square)][version]
[![build](https://img.shields.io/travis/theworkflow/route53-zone-file-exporter/master.svg?style=flat-square)][build]
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)][license]

Export Route53 hosted zone record sets into a zone file

## Install

`$ npm install -g route53-zone-file-exporter`

### CLI Usage

  Usage: route53-zone-file-exporter [options]

  Options:
    -V, --version                        output the version number
    -z, --zoneId <hosted-zone-id>        Route53 hosted zone ID
    --hostedZoneId <hosted-zone-id>      Route53 hosted zone ID (same as -z flag)
    -o --output <path>                   Output path to store zone file
    --accessKeyId <accessKeyId>          AWS accessKeyId
    --secretAccessKey <secretAccessKey>  AWS secretAccessKey
    -h, --help                           output usage information

### API Usage

```javascript
const exporter = require('route53-zone-file-exporter')

const options = {
  zoneId: 'AWSRoute53ZoneID',
  ttl: 3600,
  output: './exportedZoneFile'
}
// For full configuration options for aws config
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#constructor-property
const awsConfig = {}

exporter(options, awsConfig)
  .then(zoneFile => console.log(zoneFile))
  .catch(err => console.error(err))
```

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

[MIT](LICENSE)

[version]: https://www.npmjs.com/package/route53-zone-file-exporter
[build]: https://travis-ci.org/theworkflow/route53-zone-file-exporter
[license]: https://raw.githubusercontent.com/theworkflow/route53-zone-file-exporter/master/LICENSE
