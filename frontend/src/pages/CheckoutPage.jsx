import React, { useState } from 'react';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderApi } from '../api/orderApi';

export const CheckoutPage = ({ onOrderSuccess, onOpenAuth }) => {
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [address, setAddress] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [country, setCountry] = useState(user?.address?.country || 'USA');

  // Payment Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardholderName, setCardholderName] = useState(user?.name || '');

  const [processing, setProcessing] = useState(false);

  const handleAutofillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExp('12/34');
    setCardCvc('123');
    setCardholderName(user?.name || 'Jane Doe');
    showToast('Autofilled Stripe Sandbox Test Card', 'info');
  };

  const handleProcessCheckout = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    if (!address || !city || !postalCode) {
      showToast('Please fill out all shipping fields', 'error');
      return;
    }

    setProcessing(true);

    try {
      // 1. Create order on backend
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod: 'Stripe Sandbox',
      };

      const orderRes = await orderApi.createOrder(orderPayload);
      const createdOrder = orderRes.data;

      // 2. Initialize payment intent
      const intentRes = await orderApi.createPaymentIntent(createdOrder._id);

      // 3. Verify payment in sandbox mode
      const verifyRes = await orderApi.verifyPayment({
        orderId: createdOrder._id,
        paymentId: intentRes.paymentIntentId || `pi_sandbox_${Date.now()}`,
        status: 'succeeded',
      });

      // 4. Success handling
      clearCart();
      showToast('Payment successful! Your order has been placed.', 'success');
      onOrderSuccess(verifyRes.data);
    } catch (err) {
      showToast(err.message || 'Payment failed. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
          <h2>Your bag is currently empty</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Add some products from the catalog to proceed through checkout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="heading-display" style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
          Secure Checkout
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
          Stripe Sandbox Test Mode • Encrypted Order Processing
        </p>

        <form onSubmit={handleProcessCheckout}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {/* Left Column: Shipping & Payment details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Shipping Address Panel */}
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <Truck size={20} color="var(--accent-primary)" />
                  1. Shipping Information
                </h3>

                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="742 Evergreen Terrace"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      required
                      placeholder="Springfield"
                      className="form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Postal / ZIP Code</label>
                    <input
                      type="text"
                      required
                      placeholder="97477"
                      className="form-control"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

              {/* Payment Details Panel */}
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CreditCard size={20} color="#10b981" />
                    2. Payment Sandbox
                  </h3>
                  <span className="badge badge-success">Stripe Test Mode</span>
                </div>

                {/* Test Helper Notice */}
                <div
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    border: '1px dashed rgba(99, 102, 241, 0.35)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Sparkles size={14} /> Stripe Official Test Card
                    </span>
                    <button
                      type="button"
                      onClick={handleAutofillTestCard}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                    >
                      Autofill Card
                    </button>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Card: <code>4242 4242 4242 4242</code> | Exp: <code>12/34</code> | CVC: <code>123</code>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Name on Card</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="form-control"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="4242 4242 4242 4242"
                    className="form-control"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Expiration Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      className="form-control"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVC / Security Code</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      className="form-control"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Placement */}
            <div>
              <div className="glass-panel" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Order Summary
                </h3>

                {/* Items preview */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    marginBottom: '1.5rem',
                    maxHeight: '260px',
                    overflowY: 'auto',
                  }}
                >
                  {cartItems.map((item) => (
                    <div key={item.product} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <img
                        src={item.image}
                        alt=""
                        style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>Items Subtotal</span>
                    <span>${itemsPrice.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>Shipping</span>
                    <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>Estimated Tax (8%)</span>
                    <span>${taxPrice.toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#fff',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span>Total Amount</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  <Lock size={18} />
                  {processing ? 'Processing Payment...' : `Confirm & Pay $${totalPrice.toFixed(2)}`}
                </button>

                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={14} color="#10b981" /> 256-bit SSL Sandbox Security Verified
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
