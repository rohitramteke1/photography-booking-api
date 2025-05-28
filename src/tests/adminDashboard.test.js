
const request = require('supertest');
const app = require('../app');

describe('Admin Dashboard API', () => {
  it('should block access to stats route without admin token', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.statusCode).toBe(401);
  });
});
