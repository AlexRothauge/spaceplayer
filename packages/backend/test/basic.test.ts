import 'reflect-metadata';
import { Helper } from './helper';
import request from 'supertest';
import 'jest';
// tslint:disable-next-line: no-var-requires
require('dotenv-safe').config({ path: '../../infra/env_vars/.env', example: '../../infra/env_vars/.env.example' });

describe('basic test', () => {
  const helper = new Helper();

  beforeAll(async () => {
    await helper.init();
  });

  afterAll(async () => {
    await helper.shutdown();
  });
  it('should be able to reach the api', async (done) => {
    request(helper.app)
      .get('/api/')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.message).not.toBeNull();
        done();
      });
  });
});
