
const request = require('supertest');
const app = require('../app');

describe('Photography Services API', () => {
  it('should get all services', async () => {
    const res = await request(app).get('/api/services');
    expect(res.statusCode).toBe(200);
  });
});
