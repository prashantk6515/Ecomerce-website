import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  CheckCircle,
  AlertTriangle,
  Shield,
  Truck,
  RotateCcw,
  MessageSquare,
  Plus,
  Minus,
} from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RatingStars } from '../components/common/RatingStars';

export const ProductDetailPage = ({ productId, onBack, onOpenAuth }) => {
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await productApi.getProductById(productId);
        setProduct(res.data);
        if (res.data?.images?.length) {
          setSelectedImage(res.data.images[0]);
        }
      } catch (err) {
        showToast('Failed to load product details', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchDetails();
    }
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await productApi.createReview(productId, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setProduct(res.data);
      setReviewComment('');
      showToast('Review submitted successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
          Loading product specifications...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h3>Product not found</h3>
          <button onClick={onBack} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="section">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            marginBottom: '2rem',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} />
          Back to Catalog
        </button>

        {/* Product Overview Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {/* Left Column: Image Viewer */}
          <div>
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1rem',
                aspectRatio: '1 / 1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={selectedImage || product.images?.[0]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: `2px solid ${selectedImage === img ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      padding: 0,
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Actions & Specs */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">{product.category}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Brand: {product.brand}</span>
            </div>

            <h1 className="heading-display" style={{ fontSize: '2.2rem', marginBottom: '1rem', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            {/* Ratings & Reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <RatingStars rating={product.rating} numReviews={product.numReviews} size={18} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>|</span>
              <span style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle size={14} /> Verified Authentic
              </span>
            </div>

            {/* Price Display */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>
                ${Number(product.price).toFixed(2)}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Taxes calculated at checkout
              </span>
            </div>

            {/* Inventory Stock Status */}
            <div style={{ marginBottom: '1.75rem' }}>
              {isOutOfStock ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.925rem', fontWeight: 600 }}>
                  <AlertTriangle size={18} /> Currently Out of Stock
                </div>
              ) : product.stock <= 5 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', fontSize: '0.925rem', fontWeight: 600 }}>
                  <AlertTriangle size={18} /> Only {product.stock} units left in stock!
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.925rem', fontWeight: 600 }}>
                  <CheckCircle size={18} /> In Stock ({product.stock} units available)
                </div>
              )}
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              {!isOutOfStock && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 700, fontSize: '1.05rem' }}>
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}

              <button
                disabled={isOutOfStock}
                onClick={() => addToCart(product, quantity)}
                className={`btn btn-primary btn-lg ${isOutOfStock ? 'disabled' : ''}`}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  opacity: isOutOfStock ? 0.5 : 1,
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                }}
              >
                <ShoppingBag size={20} />
                {isOutOfStock ? 'Sold Out' : `Add to Bag • $${(product.price * quantity).toFixed(2)}`}
              </button>
            </div>

            {/* Value Guarantees */}
            <div
              className="glass-panel"
              style={{
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                <Truck size={18} color="var(--accent-primary)" />
                <span>Express 2-Day Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                <Shield size={18} color="#10b981" />
                <span>Official Warranty Included</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                <RotateCcw size={18} color="#06b6d4" />
                <span>30-Day Hassle-free Returns</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                <CheckCircle size={18} color="#f59e0b" />
                <span>Stripe Sandbox Secured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Tabs & Specifications */}
        <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
            Product Description & Features
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {product.description}
          </p>
        </div>

        {/* Customer Reviews Section */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={22} color="var(--accent-primary)" />
                Customer Reviews ({product.numReviews})
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Average Rating: {Number(product.rating).toFixed(1)} out of 5 stars
              </p>
            </div>
          </div>

          {/* Add Review Form */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '2.5rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1rem' }}>
              Write a Review
            </h4>

            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Rating</label>
                  <select
                    className="form-control"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    style={{ maxWidth: '200px' }}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 - Average)</option>
                    <option value={2}>⭐⭐ (2 - Below Expectations)</option>
                    <option value={1}>⭐ (1 - Poor)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Review Comments</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share your experience regarding sound quality, build, or features..."
                    className="form-control"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn btn-primary btn-sm"
                >
                  {submittingReview ? 'Submitting...' : 'Post Customer Review'}
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Please sign in to share your verified review.
                </span>
                <button onClick={onOpenAuth} className="btn btn-secondary btn-sm">
                  Sign In to Review
                </button>
              </div>
            )}
          </div>

          {/* Reviews List */}
          {product.reviews && product.reviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {product.reviews.map((rev, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rev.name}</span>
                    <RatingStars rating={rev.rating} size={14} />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>{rev.comment}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>
                    {new Date(rev.createdAt || Date.now()).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
              No reviews yet. Be the first customer to review this product!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
