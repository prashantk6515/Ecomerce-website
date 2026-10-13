import React from 'react';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { RatingStars } from '../common/RatingStars';

export const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.45)';
        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          paddingTop: '75%',
          backgroundColor: '#0f1422',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => onViewDetails(product._id)}
      >
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Category Badge */}
        <span
          className="badge badge-primary"
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            backdropFilter: 'blur(8px)',
            background: 'rgba(16, 22, 35, 0.85)',
          }}
        >
          {product.category}
        </span>

        {/* Out of Stock Ribbon */}
        {isOutOfStock && (
          <div
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'rgba(239, 68, 68, 0.9)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            OUT OF STOCK
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
          {product.brand}
        </div>

        <h3
          onClick={() => onViewDetails(product._id)}
          style={{
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            marginBottom: '0.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.35,
          }}
        >
          {product.name}
        </h3>

        <div style={{ marginBottom: '1rem' }}>
          <RatingStars rating={product.rating} numReviews={product.numReviews} size={14} />
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
              Price
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onViewDetails(product._id)}
              className="btn btn-secondary btn-sm"
              title="Quick view"
              aria-label="View product details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className={`btn btn-primary btn-sm ${isOutOfStock ? 'disabled' : ''}`}
              style={{
                opacity: isOutOfStock ? 0.5 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              }}
              title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
            >
              <ShoppingBag size={16} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
