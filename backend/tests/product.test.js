const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const generateToken = require('../src/utils/generateToken');

let mongoServer;
let adminToken;
let customerToken;
let customerUser;
let createdProductId;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Create admin user
  const admin = await User.create({
    name: 'Admin Boss',
    email: 'adminboss@test.com',
    password: 'password123',
    role: 'admin',
  });
  adminToken = generateToken(admin._id, admin.role);

  // Create normal customer
  customerUser = await User.create({
    name: 'Customer Bob',
    email: 'bobbob@test.com',
    password: 'password123',
    role: 'customer',
  });
  customerToken = generateToken(customerUser._id, customerUser.role);
});

test.after(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

test('Product Catalog & Admin Management Test Suite', async (t) => {
  await t.test('POST /api/products - Admin should be able to create a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Aura Studio Wireless Headphones',
        description: 'Premium wireless headphones with ANC',
        price: 249.99,
        category: 'Audio',
        brand: 'Aura',
        stock: 15,
        images: ['https://example.com/headphones.jpg'],
        featured: true,
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.name, 'Aura Studio Wireless Headphones');
    assert.strictEqual(res.body.data.price, 249.99);
    createdProductId = res.body.data._id;
  });

  await t.test('POST /api/products - Customer should NOT be allowed to create product (403)', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Unauthorized Product',
        description: 'Should fail',
        price: 99,
        category: 'Audio',
        stock: 5,
        images: ['https://example.com/fail.jpg'],
      });

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('Administrator privileges required'));
  });

  await t.test('GET /api/products - Public should fetch products catalog', async () => {
    const res = await request(app).get('/api/products');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.count >= 1, true);
    assert.strictEqual(res.body.data[0].name, 'Aura Studio Wireless Headphones');
  });

  await t.test('GET /api/products - Should filter by keyword', async () => {
    const res = await request(app).get('/api/products?keyword=Wireless');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.count, 1);
    assert.ok(res.body.data[0].name.includes('Wireless'));
  });

  await t.test('GET /api/products - Should filter by category', async () => {
    const res = await request(app).get('/api/products?category=Audio');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.count, 1);

    const emptyRes = await request(app).get('/api/products?category=Footwear');
    assert.strictEqual(emptyRes.status, 200);
    assert.strictEqual(emptyRes.body.count, 0);
  });

  await t.test('GET /api/products/:id - Should fetch single product by id', async () => {
    const res = await request(app).get(`/api/products/${createdProductId}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data._id, createdProductId);
  });

  await t.test('POST /api/products/:id/reviews - Customer can submit a product review', async () => {
    const res = await request(app)
      .post(`/api/products/${createdProductId}/reviews`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        rating: 5,
        comment: 'Crystal clear sound and deep bass!',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.numReviews, 1);
    assert.strictEqual(res.body.data.rating, 5);
  });

  await t.test('PUT /api/products/:id - Admin should be able to update stock & price', async () => {
    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        price: 229.99,
        stock: 30,
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.price, 229.99);
    assert.strictEqual(res.body.data.stock, 30);
  });
});
