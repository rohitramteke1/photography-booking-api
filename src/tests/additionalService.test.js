
const request = require('supertest');
const app = require('../app');

describe('Additional Services API', () => {
  it('should get all additional services', async () => {
    const res = await request(app).get('/api/additional-services');
    expect(res.statusCode).toBe(200);
  });
});
