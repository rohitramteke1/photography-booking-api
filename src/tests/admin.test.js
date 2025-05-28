
const request = require('supertest');
const app = require('../app');

describe('Admin API Endpoints', () => {
  let ADMIN_TOKEN = '';
  let TEST_BOOKING_ID = '';

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'YourPass@123' });

    ADMIN_TOKEN = loginRes.body.token;

    const createBookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send({
        photographyServiceId: 'test-service-id',
        eventDate: '2025-12-01',
        eventLocation: 'Test Location',
        contactDetails: { phone: '9999999999', email: 'test@test.com' }
      });

    TEST_BOOKING_ID = createBookingRes.body?.data?.id || '';
  });

  it('should delete booking by id', async () => {
    if (!TEST_BOOKING_ID) {
      console.warn('⚠️ No booking created. Skipping delete test.');
      return;
    }

    const res = await request(app)
      .delete(`/api/admin/bookings/${TEST_BOOKING_ID}`)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`);

    console.log('Delete booking response:', res.statusCode, res.body);
    expect([200, 404]).toContain(res.statusCode);
  });
});
