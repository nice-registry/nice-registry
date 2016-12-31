const expect = require('chai').expect
const supertest = require('supertest')
const app = require('../script/server.js')

describe('Server', function () {
  this.timeout(15 * 1000)

  describe('/', () => {
    it('redirects to github repo readme', (done) => {
      supertest(app)
        .get('/')
        .expect(302)
        .end((err, res) => {
          if (err) throw err
          expect(res.header.location).to.equal('https://github.com/zeke/nice-registry#readme')
          done()
        })
    })
  })

  describe('/package', () => {
    it('accepts a single package name as the path', (done) => {
      supertest(app)
        .get('/package/cheerio')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err
          expect(res.body.name).to.equal('cheerio')
          done()
        })
    })

    it('returns a 404 and helpful error message for scoped packages', (done) => {
      supertest(app)
        .get('/package/@types/validator')
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          if (err) throw err
          expect(res.body.error).to.include('Sorry')
          done()
        })
    })

    it('honors the `pick` query param', (done) => {
      supertest(app)
        .get('/package/express?pick=name,description')
        .end((err, res) => {
          if (err) throw err
          expect(Object.keys(res.body)).to.deep.equal(['name', 'description'])
          done()
        })
    })

    it('honors the `omit` query param', (done) => {
      supertest(app)
        .get('/package/lodash?omit=description,keywords')
        .end((err, res) => {
          if (err) throw err
          const props = Object.keys(res.body)
          expect(props).to.include('name')
          expect(props).to.not.include('description')
          expect(props).to.not.include('keywords')
          done()
        })
    })

    it('returns dependent lists and counts', (done) => {
      supertest(app)
        .get('/package/glob')
        .end((err, res) => {
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

    it('returns download counts', (done) => {
      supertest(app)
        .get('/package/mocha')
        .end((err, res) => {
          if (err) throw err
          const pkg = res.body
          expect(pkg.downloadsOnDay).to.be.an('object')
          expect(Object.keys(pkg.downloadsOnDay).length).to.be.above(3 * 360) // ~ 3 years
          expect(pkg.averageDownloadsPerDay).to.be.above(10 * 1000)
          done()
        })
    })

    it('returns profiles of npm package owners', (done) => {
      supertest(app)
        .get('/package/component')
        .end((err, res) => {
          if (err) throw err
          const pkg = res.body
          expect(pkg.owners).to.be.an('array')
          expect(pkg.owners.length).to.be.above(5)
          const props = Object.keys(pkg.owners[0])
          expect(props).to.include('name')
          expect(props).to.include('email')
          expect(props).to.include('homepage')
          expect(props).to.include('github')
          expect(props).to.include('twitter')
          expect(props).to.include('freenode')
          expect(props).to.include('gravatar')
          done()
        })
    })

    it('returns metadata for GitHub repos, if token is present', (done) => {
      supertest(app)
        .get('/package/color-namer')
        .end((err, res) => {
          if (err) throw err
          const pkg = res.body
          const repo = pkg.githubRepo
          expect(repo).to.exist
          expect(repo.fullName).to.equal('zeke/color-namer')
          done()
        })
    })

    it('returns GitHub contributors, if token is present', (done) => {
      supertest(app)
        .get('/package/chai')
        .end((err, res) => {
          if (err) throw err
          const pkg = res.body
          const contributors = pkg.githubContributors
          expect(contributors).to.exist
          expect(Object.keys(contributors[0])).to.deep.equal(['login', 'avatarUrl', `type`, `contributions`])
          done()
        })
    })
  })

  describe('/packages', () => {
    it('accepts a `packages` query param for fetching multiple packages at once', (done) => {
      supertest(app)
        .get('/packages?names=alphabet,react')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err
          expect(res.body).to.be.an('array')
          expect(res.body[0].name).to.equal('alphabet')
          expect(res.body[1].name).to.equal('react')
          done()
        })
    })
  })

  describe('/names', () => {
    it('requires `matching` query param', (done) => {
      supertest(app)
        .get('/names')
        .expect(400, done)
    })

    it('returns an array of names', (done) => {
      supertest(app)
        .get('/names?matching=express')
        .expect(200)
        .end((err, res) => {
          if (err) throw err
          const names = res.body
          expect(names).to.be.an('array')
          expect(names).to.include('express')
          expect(names.every(name => typeof name === 'string')).to.be.true
          done()
        })
    })
  })
})
