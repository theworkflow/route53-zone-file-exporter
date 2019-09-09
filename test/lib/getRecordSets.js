const { expect } = require('code')
const lab = require('lab')
const sinon = require('sinon')

const AWS = require('aws-sdk')

const client = require('../../lib/getRecordSets')

const { afterEach, before, describe, it } = exports.lab = lab.script()
const listStub = sinon.stub()
const getStub = sinon.stub()

describe('lib/getRecordSets', () => {
  const options = {
    zoneId: 'fakeZoneId',
    ttl: 3600
  }
  const awsConfig = { test: true }

  before(() => {
    sinon.stub(AWS, 'Route53').returns({
      listResourceRecordSets: listStub,
      getHostedZone: getStub
    })
  })

  afterEach(() => {
    listStub.reset()
    getStub.reset()
  })

  it('should fail if getting hosted zone data fails', async () => {
    let error
    getStub.yields(new Error('get hosted zone error'))

    try {
      await client(options, awsConfig)
    } catch (err) {
      error = err
    }

    expect(error.message).to.equal('get hosted zone error')
    expect(listStub.called).to.equal(false)
  })

  it('should fail if listing resources fails', async () => {
    let error
    getStub.yields(null, { Name: 'example.com' })
    listStub.yields(new Error('list resources error'))

    try {
      await client(options, awsConfig)
    } catch (err) {
      error = err
    }

    expect(getStub.callCount).to.equal(1)
    expect(error.message).to.equal('list resources error')
  })

  it('should succeed', async () => {
    let error, res
    getStub.yields(null, { Name: 'example.com' })
    listStub.yields(null, { ResourceRecordSets: [] })

    try {
      res = await client(options, awsConfig)
    } catch (err) {
      error = err
    }

    const listCall = listStub.getCall(0)
    const getCall = getStub.getCall(0)

    expect(error).to.not.exist()
    expect(res).to.equal({
      origin: 'example.com',
      recordSets: []
    })
    expect(getStub.callCount).to.equal(1)
    expect(listStub.callCount).to.equal(1)
    expect(getCall.args[0]).to.equal({ Id: 'fakeZoneId' })
    expect(listCall.args[0]).to.equal({ HostedZoneId: 'fakeZoneId' })
  })
})
