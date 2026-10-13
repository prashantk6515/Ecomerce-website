import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { productApi } from '../api/productApi';
import { ProductCard } from '../components/product/ProductCard';

export const ShopPage = ({ initialCategory = 'all', initialKeyword = '', onViewProduct }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [category, setCategory] = useState(initialCategory);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Fetch categories once
  useEffect(() => {
    productApi.getCategories().then((res) => {
      setCategories(res.data || []);
    });
  }, []);

  // Fetch products when filters or pagination change
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await productApi.getProducts({
          category,
          keyword,
          sortBy,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          page,
          limit: 9,
        });
        setProducts(res.data || []);
        setTotal(res.total || 0);
        setPages(res.pages || 1);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [category, keyword, sortBy, minPrice, maxPrice, page]);

  const handleResetFilters = () => {
    setCategory('all');
    setKeyword('');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  return (
    <div className="section">
      <div className="container">
        {/* Header Bar */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="heading-display" style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
            Product Catalog
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Showing {products.length} of {total} premium curated items
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Top Row: Search and Sort */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search products by title or keyword..."
                className="form-control"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>

            {/* Sorting Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                Sort By:
              </span>
              <select
                className="form-control"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                style={{ cursor: 'pointer' }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Price Filter & Reset */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Min $"
                className="form-control"
                style={{ width: '90px' }}
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
              />
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              <input
                type="number"
                placeholder="Max $"
                className="form-control"
                style={{ width: '90px' }}
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
              />
              <button
                onClick={handleResetFilters}
                className="btn btn-secondary btn-sm"
                title="Reset filters"
                style={{ padding: '0.65rem' }}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>
              Categories:
            </span>
            <button
              onClick={() => {
                setCategory('all');
                setPage(1);
              }}
              className={`badge ${category === 'all' ? 'badge-primary' : ''}`}
              style={{
                cursor: 'pointer',
                padding: '0.45rem 0.85rem',
                backgroundColor: category === 'all' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: '#fff',
                border: '1px solid var(--border-subtle)',
              }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`badge ${category === cat ? 'badge-primary' : ''}`}
                style={{
                  cursor: 'pointer',
                  padding: '0.45rem 0.85rem',
                  backgroundColor: category === cat ? 'var(--accent-primary)' : 'var(--bg-surface)',
                  color: '#fff',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div
            className="glass-panel"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              maxWidth: '480px',
              margin: '2rem auto',
            }}
          >
            <SlidersHorizontal size={40} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No products found
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              No items matched your current filter criteria. Try adjusting the search term or clearing filters.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.75rem',
                marginBottom: '3rem',
              }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewDetails={onViewProduct}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '2rem',
                }}
              >
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: page <= 1 ? 0.4 : 1 }}
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>

                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ minWidth: '38px' }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={page >= pages}
                  onClick={() => setPage(page + 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: page >= pages ? 0.4 : 1 }}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
