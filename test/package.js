const expect = require('chai').expect
const Package = require('../lib/fetchers/package')
const getFullPackage = require('../lib/get-full-package')

describe('Package', () => {
  it('works', (done) => {
    new Package('express')
      .then(pkg => {
        expect(pkg).to.be.an('object')
        done()
      })
      .catch(error => {
        console.error(error)
      })
  })
})

describe('FullPackage', () => {
  it('gets package data and dependents data', (done) => {
    getFullPackage('express')
      .then(pkg => {
        expect(pkg).to.be.an('object')
        expect(pkg.directDependents).to.be.an('array')
        done()
      })
      .catch(error => {
        console.error(error)
      })
  })
})
