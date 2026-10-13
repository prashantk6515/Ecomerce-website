import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';

export const OrderHistoryPage = ({ onNavigateShop }) => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Delivered</span>;
      case 'Shipped':
        return <span className="badge badge-primary"><Truck size={12} /> In Transit</span>;
      case 'Paid':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Paid</span>;
      default:
        return <span className="badge badge-warning"><Clock size={12} /> {status}</span>;
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="heading-display" style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
            My Orders
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track previous purchases, shipping destinations, and real-time delivery status.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Retrieving order history...
          </div>
        ) : orders.length === 0 ? (
          <div
            className="glass-panel"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            <Package size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No orders placed yet
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              When you purchase items from AURA, their real-time statuses will appear right here.
            </p>
            <button onClick={onNavigateShop} className="btn btn-primary">
              <ShoppingBag size={18} />
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                className="glass-panel"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                {/* Order Top Bar */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date Placed</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>
                      ${Number(order.totalPrice).toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Status
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Items Purchased */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.image}
                        alt=""
                        style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.925rem', fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} • ${Number(item.price).toFixed(2)} each
                        </div>
                      </div>
                      <span style={{ fontWeight: 700 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping Destination */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.825rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Truck size={16} color="var(--accent-primary)" />
                  Delivering to: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
