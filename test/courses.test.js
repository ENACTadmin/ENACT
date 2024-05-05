// For Chai
import { expect } from 'chai';
// For Supertest
import supertest from 'supertest';
import app from '../app.js';  // Adjust the path as needed

// Example test
describe('GET /some-route', () => {
  it('responds with status 200', async () => {
    const response = await supertest(app).get('/');
    expect(response.status).to.equal(200);
  });
});
