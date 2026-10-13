import React, { useState } from 'react';
import { ShoppingBag, Search, User, ShieldCheck, LogOut, Package, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar = ({ onNavigate, currentView, onOpenAuth }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop', { keyword: searchQuery.trim() });
    }
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(10, 13, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
          gap: '1.5rem',
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)',
            }}
          >
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>⚡</span>
          </div>
          <span
            className="heading-display"
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AURA
          </span>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: 1,
            maxWidth: '420px',
            position: 'relative',
            display: 'none',
            ...(window.innerWidth > 640 ? { display: 'block' } : {}),
          }}
        >
          <input
            type="text"
            placeholder="Search audio, electronics, gear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
            }}
          />
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.9rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
        </form>

        {/* Navigation Links (Desktop) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              fontWeight: 600,
              fontSize: '0.925rem',
              color: currentView === 'home' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('shop')}
            style={{
              fontWeight: 600,
              fontSize: '0.925rem',
              color: currentView === 'shop' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
          >
            Explore Catalog
          </button>

          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className="badge badge-primary"
              style={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
              }}
            >
              <ShieldCheck size={14} />
              Admin Portal
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              transition: 'all var(--transition-fast)',
            }}
            aria-label="Open Cart"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  color: '#fff',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(99, 102, 241, 0.6)',
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth Menu */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--accent-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    padding: '0.6rem',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 200,
                    animation: 'fadeIn 0.2s ease',
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.4rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate('orders');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <Package size={16} color="var(--accent-primary)" />
                    My Orders
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('admin');
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.55rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <ShieldCheck size={16} color="#06b6d4" />
                      Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#f87171',
                      borderTop: '1px solid var(--border-subtle)',
                      marginTop: '0.4rem',
                    }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              <User size={15} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
