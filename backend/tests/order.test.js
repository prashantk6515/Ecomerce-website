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
let testProduct;
let createdOrderId;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const admin = await User.create({
    name: 'Admin Boss',
    email: 'boss@test.com',
    password: 'password123',
    role: 'admin',
  });
  adminToken = generateToken(admin._id, admin.role);

  const customer = await User.create({
    name: 'Customer Alice',
    email: 'alice@test.com',
    password: 'password123',
    role: 'customer',
  });
  customerToken = generateToken(customer._id, customer.role);

  testProduct = await Product.create({
    name: 'Test Mechanical Keyboard',
    description: 'High-end keyboard for gaming',
    price: 120,
    category: 'Electronics',
    stock: 10,
    images: ['https://example.com/keyboard.jpg'],
  });
});

test.after(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

test('Order & Payment Lifecycle Test Suite', async (t) => {
  await t.test('POST /api/orders - Should create order and deduct inventory stock', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderItems: [
          {
            product: testProduct._id,
            name: testProduct.name,
            quantity: 2,
          },
        ],
        shippingAddress: {
          address: '456 Market St',
          city: 'San Francisco',
          postalCode: '94105',
          country: 'USA',
        },
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.orderItems.length, 1);
    assert.strictEqual(res.body.data.itemsPrice, 240); // 120 * 2
    assert.strictEqual(res.body.data.shippingPrice, 0); // > 100 free shipping
    assert.strictEqual(res.body.data.status, 'Pending');
    assert.strictEqual(res.body.data.isPaid, false);

    createdOrderId = res.body.data._id;

    // Verify stock deduction in database
    const updatedProd = await Product.findById(testProduct._id);
    assert.strictEqual(updatedProd.stock, 8); // 10 - 2
  });

  await t.test('POST /api/orders - Should reject order if quantity exceeds stock', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderItems: [
          {
            product: testProduct._id,
            quantity: 999, // exceeds stock of 8
          },
        ],
        shippingAddress: {
          address: '456 Market St',
          city: 'San Francisco',
          postalCode: '94105',
          country: 'USA',
        },
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('Insufficient stock'));
  });

  await t.test('POST /api/payments/create-payment-intent - Should initialize sandbox payment', async () => {
    const res = await request(app)
      .post('/api/payments/create-payment-intent')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ orderId: createdOrderId });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.clientSecret);
    assert.ok(res.body.paymentIntentId);
  });

  await t.test('POST /api/payments/verify - Should verify payment and mark order as Paid', async () => {
    const res = await request(app)
      .post('/api/payments/verify')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderId: createdOrderId,
        paymentId: 'pi_test_123456789',
        status: 'succeeded',
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.isPaid, true);
    assert.strictEqual(res.body.data.status, 'Paid');
  });

  await t.test('GET /api/orders/my-orders - Customer should see their order history', async () => {
    const res = await request(app)
      .get('/api/orders/my-orders')
      .set('Authorization', `Bearer ${customerToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.count, 1);
    assert.strictEqual(res.body.data[0]._id, createdOrderId);
  });

  await t.test('GET /api/orders/admin/all - Admin should fetch all customer orders', async () => {
    const res = await request(app)
      .get('/api/orders/admin/all')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.count >= 1, true);
  });

  await t.test('PUT /api/orders/:id/status - Admin should update order status to Shipped', async () => {
    const res = await request(app)
      .put(`/api/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Shipped' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'Shipped');
  });

  await t.test('GET /api/orders/admin/stats - Admin should receive aggregated dashboard analytics', async () => {
    const res = await request(app)
      .get('/api/orders/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.totalOrders >= 1, true);
    assert.strictEqual(res.body.data.totalRevenue > 0, true);
  });
});
