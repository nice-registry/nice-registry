const expect = require('chai').expect
const Package = require('./lib/package')
const Dependents = require('./lib/dependents')
const NicePackage = require('nice-package')

describe('Package', () => {
  it('works', (done) => {
    new Package('express')
      .then(pkg => {
        // console.log(pkg)
        expect(pkg).to.be.an('object')
        done()
      })
      .catch(error => {
        console.error(error)
      })
  })
})


describe('TotalPackage', () => {

  it('gets package data and dependents data', (done) => {
    getTotalPackage('express')
      .then(pkg => {
        // console.log(pkg)
        expect(pkg).to.be.an('object')
        expect(pkg.directDependents).to.be.an('array')
        done()
      })
      .catch(error => {
        console.error(error)
      })
  })
})
