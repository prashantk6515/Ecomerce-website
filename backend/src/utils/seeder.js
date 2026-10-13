require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'adminPassword123',
    role: 'admin',
    address: {
      street: '100 Silicon Way',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'USA',
    },
  },
  {
    name: 'Demo Customer',
    email: 'customer@ecommerce.com',
    password: 'customerPassword123',
    role: 'customer',
    address: {
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'USA',
    },
  },
];

const sampleProducts = [
  {
    name: 'Aura Pro Wireless Noise-Cancelling Headphones',
    description:
      'Immerse yourself in studio-grade acoustic clarity with active noise cancellation, 40-hour battery life, plush memory-foam ear cushions, and transparency mode.',
    price: 299.99,
    category: 'Audio',
    brand: 'Aura Acoustics',
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 12,
    featured: true,
  },
  {
    name: 'Vortex Mechanical Gaming Keyboard (RGB)',
    description:
      'High-performance tactile mechanical switches, aircraft-grade brushed aluminum frame, per-key RGB backlighting, and programmable macro software.',
    price: 139.5,
    category: 'Electronics',
    brand: 'Vortex',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80',
    ],
    rating: 4.7,
    numReviews: 8,
    featured: true,
  },
  {
    name: 'Chronos Ultra Smartwatch & Health Tracker',
    description:
      'Sapphire crystal AMOLED display, 24/7 heart-rate and SpO2 monitoring, built-in dual-frequency GPS, water-resistant to 50 meters, and titanium chassis.',
    price: 249.0,
    category: 'Wearables',
    brand: 'Chronos',
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 15,
    featured: true,
  },
  {
    name: 'Zenith 4K Ultra-Wide Curved Monitor 34"',
    description:
      'A cinematic 144Hz 1ms curved IPS panel with HDR400, 99% sRGB color gamut, USB-C 90W power delivery, and ergonomic height-adjustable tilt stand.',
    price: 549.99,
    category: 'Electronics',
    brand: 'Zenith Display',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    ],
    rating: 4.6,
    numReviews: 6,
    featured: true,
  },
  {
    name: 'Nomad Minimalist Leather Laptop Backpack',
    description:
      'Handcrafted full-grain Italian leather, water-repellent ballistic nylon lining, dedicated 16-inch padded laptop sleeve, and hidden RFID-blocking pocket.',
    price: 189.0,
    category: 'Accessories',
    brand: 'Nomad Gear',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 20,
    featured: false,
  },
  {
    name: 'Lumina Studio condenser Mic & Boom Arm',
    description:
      'Cardioid condenser microphone capsule with built-in pop filter, 24-bit/192kHz sampling rate, zero-latency monitoring jack, and heavy-duty desk arm.',
    price: 119.99,
    category: 'Audio',
    brand: 'Lumina Sound',
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    ],
    rating: 4.5,
    numReviews: 9,
    featured: false,
  },
  {
    name: 'Apex Precision Wireless Ergonomic Mouse',
    description:
      'Sculpted ergonomic thumb rest, multi-device fast switching via Bluetooth and 2.4GHz dongle, 8000 DPI sensor on any glass surface, and USB-C fast charging.',
    price: 79.99,
    category: 'Electronics',
    brand: 'Apex Tech',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    ],
    rating: 4.7,
    numReviews: 11,
    featured: false,
  },
  {
    name: 'Solace Anodized Aluminum Laptop Stand',
    description:
      'Precision CNC-machined aerospace aluminum, 360-degree swivel base, heat dissipation vents, and silicone anti-slip grips for laptops up to 17 inches.',
    price: 49.99,
    category: 'Accessories',
    brand: 'Solace Work',
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 14,
    featured: false,
  },
];

const seedData = async (shouldExit = false) => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    console.log('[Seeder] Cleared previous database records...');

    const createdUsers = await Promise.all(
      sampleUsers.map((user) => User.create(user))
    );
    const adminUser = createdUsers[0];

    const sampleProductsWithReviews = sampleProducts.map((p) => {
      return {
        ...p,
        reviews: [
          {
            user: createdUsers[1]._id,
            name: createdUsers[1].name,
            rating: 5,
            comment: 'Outstanding quality and fast shipping! Exceeded expectations.',
          },
        ],
      };
    });

    await Product.insertMany(sampleProductsWithReviews);

    console.log('[Seeder] Successfully imported sample users & products!');
    console.log(`[Seeder] Admin Login: ${adminUser.email} / adminPassword123`);
    console.log(`[Seeder] Customer Login: ${createdUsers[1].email} / customerPassword123`);

    if (shouldExit) process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Failed to seed data: ${error.message}`);
    if (shouldExit) process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Product.deleteMany();
    console.log('[Seeder] All database records deleted.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Failed to destroy data: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  connectDB().then(() => {
    if (process.argv[2] === '-d') {
      destroyData();
    } else {
      seedData(true);
    }
  });
}

module.exports = { seedData, destroyData, sampleUsers, sampleProducts };
