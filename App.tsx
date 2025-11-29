import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, CartProvider, ShopProvider } from './services/store';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AffiliateDashboard from './pages/AffiliateDashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';
import Offers from './pages/Offers';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminAffiliates from './pages/AdminAffiliates';
import AdminSettings from './pages/AdminSettings';

// Component to handle logic outside of Layout but inside Router
const AppLogic: React.FC = () => {
  // Global Affiliate Tracking
  useEffect(() => {
    try {
      const urlString = window.location.href;
      const match = urlString.match(/[?&]ref=([^&#]+)/);
      
      if (match && match[1]) {
        const refId = match[1];
        localStorage.setItem('e2s_referrer', refId);
        localStorage.setItem('e2s_referrer_time', Date.now().toString());
        console.log(`Tracking affiliate referral: ${refId}`);
      }
    } catch (e) {
      console.error("Error parsing affiliate ref", e);
    }
  }, []);

  return null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ShopProvider>
        <CartProvider>
          <Router>
            <AppLogic />
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="affiliates" element={<AdminAffiliates />} />
                <Route path="finance" element={<AdminAffiliates />} /> {/* Shared for now */}
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Public Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />
              <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
              <Route path="/affiliate" element={<Layout><AffiliateDashboard /></Layout>} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="/categories" element={<Layout><Categories /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/offers" element={<Layout><Offers /></Layout>} />
              
              {/* Placeholders */}
              <Route path="/search" element={<Layout><div className="min-h-[50vh] flex flex-col items-center justify-center p-10 text-center"><h2 className="text-2xl font-bold text-gray-900">Search</h2><p className="text-gray-500 mt-2">Coming Soon</p></div></Layout>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </ShopProvider>
    </AuthProvider>
  );
};

export default App;
