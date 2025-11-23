import React from 'react';
import { useShop } from '../services/store';
import ProductCard from '../components/ProductCard';
import { Tag, Percent, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Offers: React.FC = () => {
  const { products } = useShop();

  // Filter products that have a sale price
  const offerProducts = products.filter(p => p.sale_price && p.sale_price < p.price);

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="bg-red-600 text-white py-12 px-4 text-center overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           {/* Pattern */}
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
             <pattern id="offer-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
               <circle cx="2" cy="2" r="2" fill="currentColor"/>
             </pattern>
             <rect width="100%" height="100%" fill="url(#offer-dots)"/>
           </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 relative z-10 flex items-center justify-center">
          <Percent className="mr-3" size={40} /> স্পেশাল অফার
        </h1>
        <p className="text-red-100 text-lg relative z-10">সীমিত সময়ের জন্য অবিশ্বাস্য মূল্যছাড়!</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {offerProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {offerProducts.map((product) => (
              <div key={product.id} className="relative">
                <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold w-12 h-12 flex items-center justify-center rounded-full z-10 shadow-md border-2 border-white transform rotate-12">
                  -{Math.round(((product.price - (product.sale_price || 0)) / product.price) * 100)}%
                </div>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <Tag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">এই মুহূর্তে কোনো অফার নেই</h3>
            <p className="text-gray-500 mb-6">আমাদের রেগুলার কালেকশন দেখুন।</p>
            <Link to="/categories" className="px-6 py-2 bg-green-600 text-white rounded-full font-bold hover:bg-green-700">
              সব পণ্য দেখুন
            </Link>
          </div>
        )}
      </div>

      {/* Promo Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between text-white shadow-xl relative overflow-hidden">
           <ShoppingBag className="absolute -left-10 -bottom-10 text-gray-700 opacity-20 transform rotate-12" size={200} />
           <div className="relative z-10">
             <h2 className="text-2xl md:text-3xl font-bold mb-2">প্রথম অর্ডারে ১০% এক্সট্রা ডিসকাউন্ট!</h2>
             <p className="text-gray-300">চেকআউটের সময় কুপন কোড ব্যবহার করুন: <span className="text-yellow-400 font-mono font-bold">WELCOME10</span></p>
           </div>
           <Link to="/categories" className="relative z-10 mt-6 md:mt-0 px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-colors">
             কেনাকাটা করুন
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Offers;