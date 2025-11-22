import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { AuthProvider, CartProvider } from './services/store';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AffiliateDashboard from './pages/AffiliateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

// Component to handle logic outside of Layout but inside Router
const AppLogic: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Global Affiliate Tracking
    const refId = searchParams.get('ref');
    if (refId) {
      // Store referrer in localStorage for attribution during checkout (30-day window logic)
      localStorage.setItem('e2s_referrer', refId);
      localStorage.setItem('e2s_referrer_time', Date.now().toString());
      console.log(`Tracking affiliate referral: ${refId}`);
    }
  }, [searchParams]);

  return null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppLogic />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/affiliate" element={<AffiliateDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/categories" element={<div className="min-h-[50vh] flex flex-col items-center justify-center p-10 text-center"><h2 className="text-2xl font-bold text-gray-900">Categories</h2><p className="text-gray-500 mt-2">Coming Soon</p></div>} />
              <Route path="/search" element={<div className="min-h-[50vh] flex flex-col items-center justify-center p-10 text-center"><h2 className="text-2xl font-bold text-gray-900">Search</h2><p className="text-gray-500 mt-2">Coming Soon</p></div>} />
              <Route path="/profile" element={<div className="min-h-[50vh] flex flex-col items-center justify-center p-10 text-center"><h2 className="text-2xl font-bold text-gray-900">Profile</h2><p className="text-gray-500 mt-2">Coming Soon</p></div>} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;