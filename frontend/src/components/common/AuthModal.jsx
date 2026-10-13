import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoginTab) {
        await login(email, password);
        showToast('Welcome back! Signed in successfully.', 'success');
      } else {
        await register({
          name,
          email,
          password,
          address: { street, city, country: 'USA' },
        });
        showToast('Account created successfully! Welcome to AURA.', 'success');
      }
      onClose();
    } catch (err) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role) => {
    setIsLoginTab(true);
    if (role === 'admin') {
      setEmail('admin@ecommerce.com');
      setPassword('adminPassword123');
      showToast('Autofilled Demo Administrator credentials', 'info');
    } else {
      setEmail('customer@ecommerce.com');
      setPassword('customerPassword123');
      showToast('Autofilled Demo Customer credentials', 'info');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Modal Dialog */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          padding: '2rem',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1001,
          animation: 'fadeIn 0.25s ease',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--text-muted)',
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Tab switchers */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => setIsLoginTab(true)}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: isLoginTab ? '#fff' : 'var(--text-muted)',
              backgroundColor: isLoginTab ? 'var(--accent-primary)' : 'transparent',
              transition: 'all var(--transition-fast)',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLoginTab(false)}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: !isLoginTab ? '#fff' : 'var(--text-muted)',
              backgroundColor: !isLoginTab ? 'var(--accent-primary)' : 'transparent',
              transition: 'all var(--transition-fast)',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Credentials Assistant */}
        <div
          style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px dashed rgba(99, 102, 241, 0.3)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
            <Sparkles size={14} />
            ONE-CLICK DEMO TEST ACCOUNTS
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.78rem' }}
            >
              <Shield size={13} color="#06b6d4" />
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('customer')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.78rem' }}
            >
              <User size={13} color="#10b981" />
              Demo Customer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLoginTab && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              placeholder="user@example.com"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              minLength={6}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLoginTab && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  placeholder="San Francisco"
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  placeholder="123 Market St"
                  className="form-control"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            {loading ? 'Processing...' : isLoginTab ? 'Sign In to Account' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};
