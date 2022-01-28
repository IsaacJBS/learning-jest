const app = require('../src/app');
const supertest = require('supertest');
const request = supertest(app);

it('a aplicação deve responder na porta 3000', () => {
    return request.get('/').then( res => {
      expect(res.statusCode).toEqual(200)
    }).catch(err => {
      throw new Error(err)
    })
})