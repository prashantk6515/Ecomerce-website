import React from 'react';
import { ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '5rem',
        padding: '4rem 0 2rem',
      }}
    >
      <div className="container">
        {/* Value proposition badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '3rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', color: 'var(--accent-primary)' }}>
              <Truck size={24} />
            </div>
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Free Express Shipping</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>On all orders above $100</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', color: '#10b981' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>2-Year Warranty</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>100% genuine guaranteed</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', color: '#06b6d4' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Stripe Sandbox Checkout</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Encrypted test transactions</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', color: '#f59e0b' }}>
              <RotateCcw size={24} />
            </div>
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>30-Day Easy Returns</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No questions asked</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} <strong style={{ color: 'var(--text-primary)' }}>AURA Technologies</strong>. Level 3 Task 1 Full-Stack Project.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>API Docs</span>
            <span>Status: Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
