const app = require('../src/app');
const supertest = require('supertest');
const request = supertest(app);

const mainUser = {name: 'Isaac', email: 'isaac.jordaobs@gmail.com', password: '123456'}

beforeAll(() => {
  // adiciona o mainUser no bd
  return request.post('/user')
  .send(mainUser)
  .then(res => {})
  .catch(err => {
    console.log(err)
  })
})

afterAll(() => {
  // remover o usuário mainUser"isaac" no banco de dados
  return request.delete(`/user/${mainUser.email}`).then( res => {})
  .catch(err => console.log(err))
})

describe('cadastro de usuário', () => {

  it('deve cadastrar um usuário com sucesso', () => {

    let time = Date.now()
    let email =  `${time}@gmail.com`
    let user = {name: 'Isaac', email, password: '12345'};

    return request.post('/user')
    .send(user)
    .then( res => {

      expect(res.statusCode).toEqual(200)
      expect(res.body.email).toEqual(email)
      
    }).catch(err => {
      throw new Error(err)
    })
  })

  it('deve impedir que um usuário de cadastre com dados vazios', () => {
    let user = {name: '', email:'', password: ''};

    return request.post('/user')
    .send(user)
    .then( res => {

      expect(res.statusCode).toEqual(400)
      
    }).catch(err => {
      throw new Error(err)
    })
  })

  it('deve impedir o cadastro com email repetido', () => {
    let time = Date.now()
    let email =  `${time}@gmail.com`
    let user = {name: 'Isaac', email, password: '12345'};

    return request.post('/user')
    .send(user)
    .then( res => {
      expect(res.statusCode).toEqual(200)
      expect(res.body.email).toEqual(email)

      return request.post('/user')
      .send(user)
      .then(res => {
        expect(res.statusCode).toEqual(400)
        expect(res.body.error).toEqual('Email já cadastrado')
      }).catch(err => {
      throw new Error(err)
      })
    }).catch(err => {
      throw new Error(err)
    })
  })
})

describe('autenticação', () => {
  it('deve retornar um token quando logar', () => {
    return request.post('/auth')
    .send({email: mainUser.email, password: mainUser.password})
    .then(res => {
      expect(res.statusCode).toEqual(200)
      expect(res.body.token).toBeDefined()
    })
    .catch(err => {
      throw new Error(err)
    })
  })
  it('deve impedir que um usuário não cadastrado se logue', () => {
    return request.post('/auth')
    .send({email: 'aa@gmail.com', password: 'aeaeae'})
    .then(res => {
      expect(res.statusCode).toEqual(403)
      expect(res.body.errors.email).toEqual('Email não cadastrado')
    })
    .catch(err => {
      throw new Error(err)
    })
  })
  it('deve impedir que um usuário se logue com uma senha errada', () => {
    return request.post('/auth')
    .send({email: mainUser.email, password: 'aeaeae'})
    .then(res => {
      expect(res.statusCode).toEqual(403)
      expect(res.body.errors.password).toEqual('Senha incorreta')
    })
    .catch(err => {
      throw new Error(err)
    })
  })
})