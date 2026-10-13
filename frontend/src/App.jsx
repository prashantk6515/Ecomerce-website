import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/common/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const navigate = (view, params = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProduct = (id) => {
    setSelectedProductId(id);
    navigate('product-detail');
  };

  const handleOrderSuccess = (order) => {
    setConfirmedOrder(order);
    navigate('order-confirmation');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onNavigate={navigate}
        currentView={currentView}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <HomePage
            onNavigate={navigate}
            onViewProduct={handleViewProduct}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage
            initialCategory={viewParams.category || 'all'}
            initialKeyword={viewParams.keyword || ''}
            onViewProduct={handleViewProduct}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailPage
            productId={selectedProductId}
            onBack={() => navigate('shop')}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={handleOrderSuccess}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentView === 'order-confirmation' && (
          <OrderConfirmationPage
            order={confirmedOrder}
            onNavigateOrders={() => navigate('orders')}
            onNavigateHome={() => navigate('home')}
          />
        )}

        {currentView === 'orders' && (
          <OrderHistoryPage
            onNavigateShop={() => navigate('shop')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardPage />
        )}
      </main>

      <Footer />

      {/* Global Slide-over Cart */}
      <CartDrawer
        onNavigateCheckout={() => navigate('checkout')}
        onNavigateShop={() => navigate('shop')}
      />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
