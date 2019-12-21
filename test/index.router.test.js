import server from '../src/index';
import request from 'supertest';

afterEach(() => { server.close(); });

describe(`GET /`, () => {
  test(`Index Page 테스트`, async (done) => {
    const response = await request(server).get('/');

    expect(response.status).toEqual(200);
    expect(response.type).toEqual(`application/json`);
    expect(response.body.data).toEqual(`Index Page`);
    done();
  });
});