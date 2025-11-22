import React from 'react';
import { ArrowRight, Zap, ShieldCheck, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../constants';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-800 bg-opacity-50 border border-indigo-700 text-indigo-200 text-sm font-semibold mb-6">
              New Collection 2025
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Discover Quality <br/> Without Compromise.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
              Shop the latest trends in electronics, fashion, and home decor. 
              Join our affiliate program and earn up to 15% commission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-white text-indigo-900 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <Link to="/affiliate" className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors flex items-center justify-center">
                Become an Affiliate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Fast Shipping</h3>
              <p className="text-sm text-gray-500 mt-1">Free delivery on orders over $50. Track your package in real-time.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Secure Payments</h3>
              <p className="text-sm text-gray-500 mt-1">We use Stripe for 100% secure payment processing.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">30 Day Returns</h3>
              <p className="text-sm text-gray-500 mt-1">Not satisfied? Return it within 30 days for a full refund.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-2">Handpicked for your daily needs</p>
          </div>
          <Link to="/categories" className="hidden md:flex items-center text-indigo-600 font-semibold hover:text-indigo-800">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-8 md:hidden text-center">
           <Link to="/categories" className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800">
            View All Products <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </section>
      
      {/* Affiliate CTA */}
      <section className="bg-gray-900 text-white py-16 px-4 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Earn Money With Us</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of creators and marketers earning passive income. 
            Share products you love and get up to 15% commission on every sale.
          </p>
          <Link to="/affiliate" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-colors shadow-lg hover:shadow-indigo-500/50">
            Join Affiliate Program
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
