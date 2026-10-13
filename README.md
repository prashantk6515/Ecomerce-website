# AURA | Full-Stack E-Commerce Platform
> **Level 3 Task 1 Internship Project**  
> Built with **React (Vite)**, **Node.js (Express)**, **MongoDB (Mongoose)**, and **Stripe Sandbox**.

---

## 🌟 Executive Summary

**AURA** is an enterprise-grade full-stack e-commerce web application featuring high-fidelity aesthetics (deep space dark mode, glassmorphism, fluid micro-interactions, responsive typography), secure authentication with Role-Based Access Control (RBAC), live search and multi-facet filtering, real-time cart state with inventory limit enforcement, customer reviews with live star recalculations, Stripe Sandbox test checkout, customer order tracking, and a comprehensive Admin Store Management suite.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Vanilla CSS Design System, Lucide Icons, Stripe React Elements |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, express-validator, Morgan, CORS, Helmet |
| **Database** | MongoDB with Mongoose ODM (Supports both local MongoDB and MongoDB Atlas cloud) |
| **Payments** | Stripe Sandbox / Test Mode + Zero-Config Sandbox Simulator Fallback |
| **Testing** | Node.js Test Runner (`node --test`), Supertest, MongoMemoryServer |

---

## 📁 Repository Structure

```text
Ecomerce-website/
├── package.json              # Monorepo runner (concurrently runs client & server)
├── .gitignore                # Workspace gitignore rules
├── README.md                 # Project documentation & verification guide
│
├── backend/
│   ├── .env.example          # Environment variables template
│   ├── .env                  # Development environment configuration
│   ├── package.json
│   ├── src/
│   │   ├── app.js            # Express app, security middleware & route mounting
│   │   ├── server.js         # HTTP server entry point & DB connection
│   │   ├── config/
│   │   │   ├── db.js         # Mongoose connection with friendly error handling
│   │   │   └── stripe.js     # Stripe SDK initialization helper
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, login, profile management
│   │   │   ├── productController.js # Catalog, search, filters, reviews, admin CRUD
│   │   │   ├── orderController.js   # Order creation, history, admin order tracking
│   │   │   └── paymentController.js # Stripe Sandbox intents & payment verification
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT verification & admin check
│   │   │   ├── errorMiddleware.js   # 404 & centralized error handler
│   │   │   └── validateMiddleware.js# express-validator result handler
│   │   ├── models/
│   │   │   ├── User.js              # User schema with bcrypt hooks & role enum
│   │   │   ├── Product.js           # Product schema with embedded reviews & text indexing
│   │   │   └── Order.js             # Order schema with items, pricing & status
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth/*
│   │   │   ├── productRoutes.js     # /api/products/*
│   │   │   ├── orderRoutes.js       # /api/orders/*
│   │   │   └── paymentRoutes.js     # /api/payments/*
│   │   └── utils/
│   │       ├── generateToken.js     # Signed JWT generator
│   │       └── seeder.js            # Database seeder (Demo users & catalog items)
│   └── tests/
│       ├── health.test.js           # Server online & 404 handler tests
│       ├── auth.test.js             # Registration, login, JWT & profile tests
│       ├── product.test.js          # Product queries, search, filter, review & CRUD tests
│       └── order.test.js            # Order checkout, sandbox payment & admin tests
│
└── frontend/
    ├── .env.example                 # Frontend env template
    ├── .env                         # Frontend development env
    ├── index.html                   # HTML5 shell with Google Fonts
    ├── package.json
    ├── vite.config.js               # Vite config with /api dev proxy
    └── src/
        ├── api/                     # Reusable API service modules
        │   ├── client.js            # Fetch wrapper with auto-JWT attachment
        │   ├── authApi.js
        │   ├── productApi.js
        │   └── orderApi.js
        ├── components/
        │   ├── common/              # Navbar, Footer, RatingStars, AuthModal
        │   ├── product/             # ProductCard with stock indicator
        │   └── cart/                # CartDrawer slide-over panel
        ├── context/
        │   ├── AuthContext.jsx      # Persistent auth state & RBAC
        │   ├── CartContext.jsx      # Persistent cart state & price math
        │   └── ToastContext.jsx     # Global alert toast notifications
        ├── pages/
        │   ├── HomePage.jsx         # Hero showcase, categories, featured drops
        │   ├── ShopPage.jsx         # Live search, filter pills, price range, sorting
        │   ├── ProductDetailPage.jsx# Image gallery, stock badge, review form
        │   ├── CheckoutPage.jsx     # Shipping address & Stripe Sandbox card test
        │   ├── OrderConfirmationPage.jsx # Order receipt confirmation
        │   ├── OrderHistoryPage.jsx # Customer order tracking
        │   └── admin/
        │       └── AdminDashboardPage.jsx # Sales stats, product CRUD, order status
        ├── index.css                # Custom CSS design system & micro-animations
        ├── App.jsx                  # Single-page view router & global overlays
        └── main.jsx                 # React root DOM mount
```

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env` / `backend/.env.example`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (Local MongoDB or MongoDB Atlas)
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_db

# JWT Authentication
JWT_SECRET=ecommerce_dev_jwt_secret_key_123456789
JWT_EXPIRE=7d

# Stripe Sandbox Payment Keys (Test mode)
# In test mode, get your test keys at: https://dashboard.stripe.com/test/apikeys
# If left as placeholder, the system automatically uses the zero-config Sandbox Simulator!
STRIPE_SECRET_KEY=sk_test_placeholder_key_demo
STRIPE_PUBLISHABLE_KEY=pk_test_placeholder_key_demo

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration (`frontend/.env` / `frontend/.env.example`)

```env
VITE_API_BASE_URL=/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder_key_demo
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ installed (`node -v`)
- **npm** v9+ installed (`npm -v`)
- MongoDB (running locally as a service or via a free MongoDB Atlas connection string in `backend/.env`)

### 2. Install All Dependencies
From the root directory:
```bash
npm run install:all
```
*(Or install in each directory: `npm install` in root, `cd backend && npm install`, `cd ../frontend && npm install`)*

### 3. Seed Sample Database Records
Populate sample users (Admin and Customer) along with rich product inventory:
```bash
npm run seed
```

**Pre-seeded Demo Credentials:**
- **Administrator:** `admin@ecommerce.com` / `adminPassword123`
- **Customer:** `customer@ecommerce.com` / `customerPassword123`
*(Note: One-click autofill buttons are built directly into the UI Sign In modal for convenience!)*

### 4. Run Full Application (Concurrently)
From the root directory:
```bash
npm run dev
```
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

*(Alternatively, you can run them in separate terminal tabs using `npm run server` and `npm run client`.)*

---

## 🧪 Testing & Verification

All automated tests use an isolated in-memory MongoDB server (`mongodb-memory-server`), ensuring tests can run offline and without requiring an active external database connection.

To run the backend test suite from root:
```bash
npm run test:backend
```

### Verified Test Suites (28/28 Passing):
1. **Health & System Tests** (`health.test.js`):
   - `GET /api/health` returns status 200 and online metadata.
   - 404 handler for non-existent routes returns standardized JSON response.
2. **Authentication & RBAC Tests** (`auth.test.js`):
   - User registration with bcrypt password hashing.
   - Duplicate email registration rejection.
   - Login credential authentication & signed JWT issuance.
   - Invalid password rejection with 401 status.
   - Protected route access verification (`/api/auth/profile`).
   - Profile update with address persistence.
3. **Product Catalog & Management Tests** (`product.test.js`):
   - Administrator creating catalog items (201).
   - Standard customer forbidden from creating products (403).
   - Public product listing and pagination.
   - Regex search keyword filtering.
   - Category filtering.
   - Single product detail retrieval.
   - Review submission and live rating recalculation.
   - Administrator updating price and stock inventory.
4. **Order & Stripe Sandbox Payment Tests** (`order.test.js`):
   - Order creation from cart items & automated stock deduction.
   - Insufficient stock rejection.
   - Sandbox payment intent initialization.
   - Payment verification and order transition to `Paid`.
   - Customer order history tracking (`/api/orders/my-orders`).
   - Administrator fetching all customer orders (`/api/orders/admin/all`).
   - Administrator updating fulfillment status (`Shipped`, `Delivered`).
   - Administrator dashboard analytics aggregation.

---

## 🎯 Step-by-Step Manual Verification Walkthrough

Follow this checklist to verify every feature in the browser:

### 1. Catalog Browsing & Search
1. Open [http://localhost:5173](http://localhost:5173).
2. Browse the responsive Home hero banner, categories, and featured products.
3. Click **"Explore Catalog"** to open the Shop page.
4. Type in the search box (e.g., `"Headphones"` or `"Keyboard"`). Notice instant filtering.
5. Filter by category pills (e.g., **Audio**, **Electronics**, **Wearables**).
6. Try sorting options: *Price: Low to High*, *Price: High to Low*, *Top Rated*.

### 2. Product Details & Customer Reviews
1. Click any product card (or the eye icon).
2. Verify image gallery, stock badge ("In Stock" / "Low Stock"), technical description, and warranty perks.
3. Scroll to the **Reviews** section. If logged in, select a star rating and leave a review. Notice the immediate update in average rating.

### 3. Shopping Cart & Inventory Enforcement
1. Choose an item quantity and click **"Add to Bag"**.
2. Notice the cart drawer slide in from the right with real-time price calculations (Subtotal, Shipping rules: Free over $100, 8% Tax, and Total).
3. Test incrementing (`+`) and decrementing (`-`) quantity. Try increasing beyond the item's stock count to see the inventory limit alert.

### 4. Authentication (Customer & Admin)
1. Click **"Sign In"** in the top navigation.
2. Click the **"Demo Customer"** one-click autofill button and submit to log in as a customer.
3. Log out and try the **"Demo Admin"** button to log in as an administrator. Notice the **"Admin Portal"** badge in the navbar.

### 5. Checkout & Stripe Sandbox Payment
1. With items in your cart, click **"Proceed to Checkout"**.
2. The shipping address pre-fills with your customer profile address.
3. In the Payment section, notice the Stripe Sandbox instructions. Click **"Autofill Card"** to insert the official Stripe test card:
   - **Card Number:** `4242 4242 4242 4242`
   - **Expiry:** `12/34`
   - **CVC:** `123`
4. Click **"Confirm & Pay"**.
5. Once processed, you will be redirected to the **Order Confirmation** page with your order reference and receipt.
6. Click **"View Order History"** to see your order listed under **My Orders** with status **Paid**.

### 6. Admin Store Management Suite
1. Log in as Administrator (`admin@ecommerce.com` / `adminPassword123`).
2. Click **"Admin Portal"** in the navbar.
3. View the live analytics dashboard (Total Revenue, Total Orders, Pending Orders, Low Stock Items).
4. In the **Product Catalog** tab:
   - Click **"Add New Product"** to publish a new product.
   - Click the **Edit** icon on any product to adjust price or stock.
   - Click the **Delete** icon to remove a product.
5. In the **Customer Orders** tab:
   - Find the order you placed and change the status from `Paid` to `Shipped` or `Delivered`.
   - Revisit **My Orders** as a customer to see the live status update!

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/profile` | Private | Retrieve current user profile |
| `PUT` | `/api/auth/profile` | Private | Update user profile & address |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List products (search, filter, sort, paginate) |
| `GET` | `/api/products/categories` | Public | Retrieve distinct categories |
| `GET` | `/api/products/featured` | Public | Retrieve featured showcase products |
| `GET` | `/api/products/:id` | Public | Retrieve single product details & reviews |
| `POST` | `/api/products/:id/reviews`| Customer | Post product review & rating |
| `POST` | `/api/products` | Admin | Create new catalog product |
| `PUT` | `/api/products/:id` | Admin | Update existing product |
| `DELETE`| `/api/products/:id` | Admin | Delete product from catalog |

### Orders & Payments (`/api/orders` & `/api/payments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Customer | Create order & deduct inventory |
| `GET` | `/api/orders/my-orders` | Customer | Retrieve customer order history |
| `GET` | `/api/orders/:id` | Private | Retrieve order details |
| `GET` | `/api/orders/admin/all` | Admin | Retrieve all customer orders |
| `GET` | `/api/orders/admin/stats`| Admin | Retrieve sales & order analytics |
| `PUT` | `/api/orders/:id/status`| Admin | Update order status (`Shipped`, `Delivered`) |
| `GET` | `/api/payments/config` | Public | Retrieve Stripe publishable key |
| `POST` | `/api/payments/create-payment-intent` | Private | Create Stripe payment intent |
| `POST` | `/api/payments/verify` | Private | Verify payment & mark order `Paid` |

---

## 🔒 Security Best Practices Implemented
- **Password Security:** Salted hashing with `bcryptjs` (salt rounds: 10) executed automatically in Mongoose schema pre-save hooks.
- **Token Security:** Stateless JSON Web Tokens (JWT) signed with secret key and expiration limits.
- **Role-Based Authorization:** Strict server-side middleware enforcing customer vs administrator role tiers.
- **Defensive Pricing:** Order prices, tax, and shipping calculations are strictly re-calculated on the server to prevent client-side price tampering.
- **HTTP Security:** `helmet` for security headers, strict CORS policy, and normalized input sanitization.
