import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Package,
  AlertTriangle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  Layers,
  X,
  Search,
} from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { productApi } from '../../api/productApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminDashboardPage = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });

  // Products State
  const [products, setProducts] = useState([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product Form State
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Electronics');
  const [prodStock, setProdStock] = useState('10');
  const [prodImage, setProdImage] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial stats & products
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordersRes] = await Promise.all([
        orderApi.getAdminStats(),
        productApi.getProducts({ limit: 50 }),
        orderApi.getAllOrders(),
      ]);

      setStats(statsRes.data || {});
      setProducts(prodRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (err) {
      showToast('Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdPrice('');
    setProdCategory('Electronics');
    setProdStock('15');
    setProdImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80');
    setProdFeatured(false);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdPrice(prod.price.toString());
    setProdCategory(prod.category);
    setProdStock(prod.stock.toString());
    setProdImage(prod.images?.[0] || '');
    setProdFeatured(Boolean(prod.featured));
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: prodName,
        description: prodDesc,
        price: Number(prodPrice),
        category: prodCategory,
        stock: Number(prodStock),
        images: [prodImage],
        featured: prodFeatured,
      };

      if (editingProduct) {
        await productApi.updateProduct(editingProduct._id, payload);
        showToast('Product updated successfully', 'success');
      } else {
        await productApi.createProduct(payload);
        showToast('New product created in catalog', 'success');
      }

      setProductModalOpen(false);
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productApi.deleteProduct(id);
      showToast('Product deleted from database', 'info');
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      showToast(`Order marked as ${newStatus}`, 'success');
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
          <h2>Access Restricted</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Administrator authentication privileges required to view the management suite.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        {/* Title & Quick Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              ADMINISTRATOR CONSOLE
            </span>
            <h1 className="heading-display" style={{ fontSize: '2.4rem' }}>
              Store Management Suite
            </h1>
          </div>

          <button onClick={handleOpenAddProduct} className="btn btn-primary">
            <Plus size={18} />
            Add New Product
          </button>
        </div>

        {/* Analytics Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Revenue</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>${stats.totalRevenue.toFixed(2)}</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
              <Package size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Orders</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalOrders}</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Orders</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.pendingOrders}</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Low Stock Items</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.lowStockProducts}</div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
          }}
        >
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: 600,
              fontSize: '1rem',
              color: activeTab === 'products' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'products' ? '2px solid var(--accent-primary)' : 'none',
              marginBottom: '-1px',
            }}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: 600,
              fontSize: '1rem',
              color: activeTab === 'orders' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'orders' ? '2px solid var(--accent-primary)' : 'none',
              marginBottom: '-1px',
            }}
          >
            Customer Orders ({orders.length})
          </button>
        </div>

        {/* Tab 1: Products Table */}
        {activeTab === 'products' && (
          <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Product</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Stock</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={prod.images?.[0]}
                        alt=""
                        style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prod.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prod.brand}</div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className="badge badge-primary">{prod.category}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>
                      ${Number(prod.price).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {prod.stock <= 5 ? (
                        <span style={{ color: '#ef4444', fontWeight: 700 }}>{prod.stock} (Low)</span>
                      ) : (
                        <span>{prod.stock} units</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="btn btn-danger btn-sm"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Orders Table */}
        {activeTab === 'orders' && (
          <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '760px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Order ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Total</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Payment</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Fulfillment Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                      #{ord._id.slice(-8).toUpperCase()}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div>{ord.user?.name || 'Customer'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.user?.email}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#10b981' }}>
                      ${Number(ord.totalPrice).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {ord.isPaid ? (
                        <span className="badge badge-success">PAID</span>
                      ) : (
                        <span className="badge badge-warning">PENDING</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                        className="form-control"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.825rem', width: 'auto' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {productModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <div
              onClick={() => setProductModalOpen(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            />

            <div
              className="glass-panel"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '540px',
                padding: '2rem',
                backgroundColor: 'var(--bg-secondary)',
                maxHeight: '90vh',
                overflowY: 'auto',
                zIndex: 1001,
              }}
            >
              <button
                onClick={() => setProductModalOpen(false)}
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Store'}
              </h3>

              <form onSubmit={handleSaveProduct}>
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="form-control"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Inventory Stock</label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                  >
                    <option value="Audio">Audio</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Image URL</label>
                  <input
                    type="url"
                    required
                    className="form-control"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    required
                    className="form-control"
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
                  />
                  <label htmlFor="featuredCheckbox" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Feature on Homepage Showcase
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  {editingProduct ? 'Save Product Changes' : 'Publish Product'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
