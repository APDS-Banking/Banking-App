const request = require('supertest');
const app = require('../server'); // Path to your Express app not sure what you used as the path

describe('Auth Routes', () => {
  test('should login a user successfully', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'user@test.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('should fail to login with invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'user@test.com',
        password: 'wrongpassword',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Invalid credentials');
  });
});
