
const request = require('supertest');
const app = require('../app');

describe('Booking API', () => {
  it('should return 401 when trying to create a booking without auth', async () => {
    const res = await request(app).post('/api/bookings').send({});
    expect(res.statusCode).toBe(401);
  });
});
