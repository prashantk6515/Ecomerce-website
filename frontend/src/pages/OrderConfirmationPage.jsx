import React from 'react';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';

export const OrderConfirmationPage = ({ order, onNavigateOrders, onNavigateHome }) => {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
        <div
          className="glass-panel"
          style={{
            padding: '3rem 2rem',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#10b981',
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>
            PAYMENT CONFIRMED
          </span>

          <h1 className="heading-display" style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
            Thank You for Your Order!
          </h1>

          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Your transaction has cleared in Stripe Sandbox mode. We are preparing your shipment now.
          </p>

          {/* Receipt details */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              textAlign: 'left',
              marginBottom: '2rem',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order Reference</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
                #{order?._id?.slice(-8).toUpperCase() || 'ORD-9821'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment ID</span>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                {order?.paymentResult?.id || 'pi_sandbox_simulated'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Address</span>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                {order?.shippingAddress?.address}, {order?.shippingAddress?.city}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Amount Paid</span>
              <span style={{ fontWeight: 700, color: '#10b981', fontSize: '1.05rem' }}>
                ${Number(order?.totalPrice || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={onNavigateOrders} className="btn btn-primary">
              <Package size={18} />
              View Order History
            </button>
            <button onClick={onNavigateHome} className="btn btn-secondary">
              <Home size={18} />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
