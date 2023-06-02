import 'reflect-metadata';
import { Helper } from '../helper';
import request from 'supertest';
import 'jest';
import { Authentication } from '../../src/api/middleware/authentication';
// tslint:disable-next-line: no-var-requires
require('dotenv-safe').config({ path: '../../infra/env_vars/.env', example: '../../infra/env_vars/.env.example' });

describe('login', () => {
  const helper = new Helper();

  const testUser = {
    userName: 'John',
    password: 'securePassword',
  };
  const secondUser = {
    userName: 'Peter',
    password: 'notSecurePassword',
  };
  const newHighScore = 200;
  const newName = 'newName';
  const wrongToken = '1289312zuzfgsduzf8721';
  let token = '';

  beforeAll(async () => {
    await helper.init();
  });

  afterAll(async () => {
    await helper.shutdown();
  });
  it('should be able to create a new user', async (done) => {
    request(helper.app)
      .post('/api/user')
      .send(testUser)
      .set('content-type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.userName).toBe(testUser.userName);
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.highScore).toBe(0);
        done();
      });
  });
  it('should be able to create a new user', async (done) => {
    request(helper.app)
      .post('/api/user')
      .send(secondUser)
      .set('content-type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.data.userName).toBe(secondUser.userName);
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.highScore).toBe(0);
        done();
      });
  });
  it('should be able to login', async (done) => {
    request(helper.app)
      .post('/api/user/token')
      .send(testUser)
      .set('content-type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end(async (err, res) => {
        if (err) throw err;
        token = res.body.data;
        const tokenData = (await Authentication.verifyToken(res.body.data)) as any;
        expect(tokenData).not.toBeNull();
        expect(tokenData.userName).toBe(testUser.userName);
        expect(tokenData.password).not.toBeDefined();
        expect(tokenData.iat).toBeDefined();
        expect(tokenData.exp).toBeDefined();
        done();
      });
  });
  it('should be able to get a user', async (done) => {
    request(helper.app)
      .get('/api/user/')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200)
      .end(async (err, res) => {
        if (err) throw err;
        expect(res.body.data.userName).toBe(testUser.userName);
        expect(res.body.data.highScore).toBe(0);
        done();
      });
  });
  it('should be able to patch a user', async (done) => {
    request(helper.app)
      .patch('/api/user/')
      .send({
        key: process.env.SECRET_KEY_512,
        userName: newName,
        highScore: newHighScore,
      })
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200)
      .end(async (err, res) => {
        if (err) throw err;
        expect(res.body.data.userName).toBe(newName);
        expect(res.body.data.highScore).toBe(newHighScore);
        done();
      });
  });

  // test for 400 codes
  it('should return 400 if create a new User with same name', async (done) => {
    request(helper.app)
      .post('/api/user')
      .send(secondUser)
      .set('content-type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .end((err) => {
        if (err) throw err;
        done();
      });
  });
  it('should return 401 if login with wrong name', async (done) => {
    request(helper.app)
      .post('/api/user/token')
      .send({
        userName: 'some',
        password: secondUser.password,
      })
      .set('content-type', 'application/json')
      .set('Accept', 'application/json')
      .expect(401)
      .end(async (err) => {
        if (err) throw err;
        done();
      });
  });
  it('should return 401 if login with wrong password', async (done) => {
    request(helper.app)
      .post('/api/user/token')
      .send({
        userName: secondUser.userName,
        password: 'wrong',
      })
      .set('content-type', 'application/json')
      .set('Accept', 'application/json')
      .expect(401)
      .end(async (err) => {
        if (err) throw err;
        done();
      });
  });
  it('should return 401 if get with wrong token', async (done) => {
    request(helper.app)
      .get('/api/user/')
      .set('Accept', 'application/json')
      .set('Authorization', wrongToken)
      .expect(401)
      .end(async (err) => {
        if (err) throw err;
        done();
      });
  });
  it('should return 401 if get with no token', async (done) => {
    request(helper.app)
      .get('/api/user/')
      .set('Accept', 'application/json')
      .expect(401)
      .end(async (err) => {
        if (err) throw err;
        done();
      });
  });
  it('should return 401 if patch with wrong token', async (done) => {
    request(helper.app)
      .patch('/api/user/')
      .set('Accept', 'application/json')
      .set('Authorization', wrongToken)
      .expect(401)
      .end(async (err) => {
        if (err) throw err;
        done();
      });
  });
  it('should return 401 if patch with no token', async (done) => {
    request(helper.app)
      .patch('/api/user/')
      .set('Accept', 'application/json')
      .expect(401)
      .end(async (err) => {
        if (err) throw err;
        done();
      });
  });
  it('should return 400 if try to patch to existing name', async (done) => {
    request(helper.app)
      .patch('/api/user/')
      .send({
        key: process.env.SECRET_KEY_512,
        userName: secondUser.userName,
        highScore: newHighScore,
      })
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(400)
      .end(async (err) => {
        if (err) throw err;
        done();
      });
  });
});
