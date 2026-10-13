const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_db');
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection Failed: ${error.message}`);
    console.warn(`[Database Hint] Ensure local MongoDB is running or update MONGO_URI in backend/.env with your MongoDB Atlas connection string.`);
    // In production we exit; in dev we log
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }
};

module.exports = connectDB;
