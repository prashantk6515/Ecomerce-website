const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('Health Check API - GET /api/health should return online status', async () => {
  const response = await request(app).get('/api/health');
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.success, true);
  assert.strictEqual(response.body.status, 'online');
  assert.strictEqual(response.body.service, 'E-Commerce Platform API');
});

test('404 Handler - GET /api/non-existent-route should return 404', async () => {
  const response = await request(app).get('/api/non-existent-route');
  assert.strictEqual(response.status, 404);
  assert.strictEqual(response.body.success, false);
  assert.ok(response.body.message.includes('Resource Not Found'));
});
