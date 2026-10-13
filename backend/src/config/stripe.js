const stripe = require('stripe');

let stripeClient = null;

if (
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') &&
  !process.env.STRIPE_SECRET_KEY.includes('placeholder')
) {
  try {
    stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
  } catch (err) {
    console.warn('[Stripe] Could not initialize real Stripe client:', err.message);
  }
}

module.exports = stripeClient;
