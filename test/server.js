const expect = require('chai').expect
const supertest = require('supertest')
const app = require('../server.js')

describe('Server', () => {
  it('works', (done) => {
    supertest(app)
      .get('/cheerio')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err  
        expect(res.body.name).to.equal('cheerio')
        done()
      })
  })
})
