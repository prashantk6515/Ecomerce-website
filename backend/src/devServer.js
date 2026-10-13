require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

async function startDev() {
  console.log('[Dev Server] Initializing built-in MongoDB engine...');
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  console.log(`[Dev Server] In-memory database active at: ${uri}`);

  // Connect Mongoose
  await mongoose.connect(uri);

  // Auto seed initial products and demo accounts
  const User = require('./models/User');
  const Product = require('./models/Product');

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('[Dev Server] Auto-seeding demo users and catalog products...');
    const { seedData } = require('./utils/seeder');
    await seedData(false);
  }

  // Start express application
  const app = require('./app');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[Dev Server] Backend API running at http://localhost:${PORT}`);
    console.log(`[Dev Server] Demo Admin: admin@ecommerce.com / adminPassword123`);
    console.log(`[Dev Server] Demo Customer: customer@ecommerce.com / customerPassword123`);
  });
}

startDev().catch((err) => {
  console.error('[Dev Server Error]', err);
});
