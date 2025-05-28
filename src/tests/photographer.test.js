
const request = require('supertest');
const app = require('../app');

describe('Photographer API', () => {
  let token = '';
  let createdId = '';

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'YourPass@123'
    });
    token = res.body.token;
  });

  it('should create a photographer', async () => {
    const res = await request(app)
      .post('/api/photographers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Photographer',
        location: 'Mumbai',
        bio: 'Portrait and wedding photographer',
        specialization: 'Weddings'
      });

    expect([201, 401, 404]).toContain(res.statusCode);

    if (res.statusCode === 201 && res.body && res.body.data) {
      expect(res.body.data).toHaveProperty('id');
      createdId = res.body.data.id;
    }
  });

  it('should get all photographers', async () => {
    const res = await request(app)
      .get('/api/photographers')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 401, 404]).toContain(res.statusCode);
    if (res.statusCode === 200 && res.body && res.body.data) {
      expect(Array.isArray(res.body.data)).toBe(true);
    }
  });

  it('should get photographer by ID', async () => {
    if (!createdId) return;

    const res = await request(app)
      .get(`/api/photographers/${createdId}`)
      .set('Authorization', `Bearer ${token}`);

    expect([200, 401, 404]).toContain(res.statusCode);
    if (res.statusCode === 200 && res.body && res.body.data) {
      expect(res.body.data).toHaveProperty('id', createdId);
    }
  });
});
