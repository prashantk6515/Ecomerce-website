import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Zap, Shield, TrendingUp, Layers } from 'lucide-react';
import { productApi } from '../api/productApi';
import { ProductCard } from '../components/product/ProductCard';

export const HomePage = ({ onNavigate, onViewProduct }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          productApi.getFeatured(),
          productApi.getCategories(),
        ]);
        setFeaturedProducts(featRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 0 4rem',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {/* Left Hero Text */}
            <div>
              <div
                className="badge badge-primary animate-fade-in"
                style={{ marginBottom: '1.25rem', gap: '0.4rem', padding: '0.35rem 0.85rem' }}
              >
                <Sparkles size={14} />
                NEXT-GEN AUDIO & TECH ESSENTIALS
              </div>

              <h1
                className="heading-display"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                  lineHeight: 1.1,
                  marginBottom: '1.25rem',
                  letterSpacing: '-0.03em',
                }}
              >
                Sound Elevated. <br />
                <span className="gradient-text">Design Perfected.</span>
              </h1>

              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--text-secondary)',
                  maxWidth: '520px',
                  marginBottom: '2rem',
                }}
              >
                Engineered with aerospace-grade precision, active acoustic damping, and tactile craftsmanship. Experience the future of sound and gear.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                <button
                  onClick={() => onNavigate('shop')}
                  className="btn btn-primary btn-lg"
                >
                  Explore Collection
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => onNavigate('shop', { category: 'Audio' })}
                  className="btn btn-secondary btn-lg"
                >
                  <Zap size={18} color="var(--accent-primary)" />
                  Featured Audio
                </button>
              </div>

              {/* Stats Highlights */}
              <div
                style={{
                  display: 'flex',
                  gap: '2.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>50k+</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Satisfied Users</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>4.9/5</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Acoustic Rating</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>100%</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Secure Sandbox</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div style={{ position: 'relative' }}>
              <div
                className="glass-panel"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80"
                  alt="Aura Studio Pro"
                  style={{
                    width: '100%',
                    height: '420px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md)',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: '2.25rem',
                    left: '2.25rem',
                    right: '2.25rem',
                    padding: '1.25rem',
                    backgroundColor: 'rgba(10, 13, 20, 0.85)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span className="badge badge-success" style={{ marginBottom: '0.25rem' }}>
                      Flagship Drop
                    </span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Aura Pro Wireless ANC</h4>
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      $299.99
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="btn btn-primary btn-sm"
                  >
                    View Specs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section style={{ padding: '2rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} color="var(--accent-primary)" />
              Browse by Category
            </h3>
            <button
              onClick={() => onNavigate('shop')}
              style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 600 }}
            >
              All Categories →
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => onNavigate('shop', { category: cat })}
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {cat}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Explore Curated</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                <TrendingUp size={14} />
                HOT PICKS
              </span>
              <h2 className="heading-display" style={{ fontSize: '2rem' }}>
                Featured Devices & Accessories
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="btn btn-secondary"
            >
              Browse All ({featuredProducts.length}+)
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onViewDetails={onViewProduct}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
