const expect = require('chai').expect
const supertest = require('supertest')
const app = require('../server.js')

describe('Server', () => {
  it('accepts a single package name as the path', (done) => {
    supertest(app)
      .get('/cheerio')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err
        expect(res.body.name).to.equal('cheerio')
        done()
      })
  })

  it('accepts a `packages` query param for fetching multiple packages at once', (done) => {
    supertest(app)
      .get('/?packages=alphabet,react')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err
        expect(res.body).to.be.an('array')
        expect(res.body[0].name).to.equal('alphabet')
        expect(res.body[1].name).to.equal('react')
        done()
      })
  })

  it('honors the `pick` query param', (done) => {
    supertest(app)
      .get('/express?pick=name,description')
      .end(function (err, res) {
        if (err) throw err
        expect(Object.keys(res.body)).to.deep.equal(['name', 'description'])
        done()
      })
  })

  it('honors the `omit` query param', (done) => {
    supertest(app)
      .get('/lodash?omit=description,keywords')
      .end(function (err, res) {
        if (err) throw err
        const props = Object.keys(res.body)
        expect(props).to.include('name')
        expect(props).to.not.include('description')
        expect(props).to.not.include('keywords')
        done()
      })
  })

  it('return dependent lists and counts', (done) => {
    supertest(app)
      .get('/glob')
      .end(function (err, res) {
        if (err) throw err
        const pkg = res.body
        expect(pkg.directDependents.length).to.be.above(100)
        expect(pkg.directDependents.length).to.equal(pkg.directDependentsCount)
        expect(pkg.directDevDependents.length).to.be.above(100)
        expect(pkg.directDevDependents.length).to.equal(pkg.directDevDependentsCount)
        expect(pkg.totalDirectDependentsCount).to.equal(pkg.directDependentsCount + pkg.directDevDependentsCount)
        done()
      })
  })
})
