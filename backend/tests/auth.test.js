const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');

let mongoServer;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

test.after(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

test('Auth System Test Suite', async (t) => {
  let customerToken = '';
  let customerId = '';

  await t.test('POST /api/auth/register - Should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'securePassword123',
        address: {
          city: 'San Francisco',
          country: 'USA',
        },
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.name, 'Jane Doe');
    assert.strictEqual(res.body.data.email, 'jane@example.com');
    assert.strictEqual(res.body.data.role, 'customer');
    assert.ok(res.body.data.token, 'Token should be returned on registration');
    assert.strictEqual(res.body.data.password, undefined, 'Password must not be returned');

    customerId = res.body.data._id;
  });

  await t.test('POST /api/auth/register - Should reject duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Jane',
        email: 'jane@example.com',
        password: 'password123',
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('already exists'));
  });

  await t.test('POST /api/auth/login - Should login with correct credentials and return token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jane@example.com',
        password: 'securePassword123',
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.strictEqual(res.body.data.email, 'jane@example.com');
    customerToken = res.body.data.token;
  });

  await t.test('POST /api/auth/login - Should reject wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jane@example.com',
        password: 'wrongPassword999',
      });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, 'Invalid email or password');
  });

  await t.test('GET /api/auth/profile - Should access profile when authenticated', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${customerToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.email, 'jane@example.com');
    assert.strictEqual(res.body.data.name, 'Jane Doe');
  });

  await t.test('GET /api/auth/profile - Should reject request without token', async () => {
    const res = await request(app).get('/api/auth/profile');

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('no token provided'));
  });

  await t.test('PUT /api/auth/profile - Should update profile information', async () => {
    const res = await request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Jane Updated Doe',
        address: {
          city: 'New York',
          country: 'USA',
        },
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.name, 'Jane Updated Doe');
    assert.strictEqual(res.body.data.address.city, 'New York');
  });
});
