import React from 'react';
import { ArrowRight, Zap, ShieldCheck, Truck, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useShop } from '../services/store';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { products, settings } = useShop();
  const featuredProducts = products.slice(0, 8); // Show more products

  if (settings.maintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="max-w-md w-full text-center animate-pulse-soft">
          <Zap size={64} className="mx-auto text-red-600 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">রক্ষণাবেক্ষণের কাজ চলছে</h1>
          <p className="text-gray-600">আমরা বর্তমানে কিছু জরুরি আপডেটের কাজ করছি। শীঘ্রই ফিরে আসছি।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-900 to-red-700 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40">
          <div className="md:w-3/4 lg:w-2/3 animate-slide-up">
            <span className="inline-block py-1 px-4 rounded-full bg-red-600 bg-opacity-90 border border-red-400 text-white text-sm font-bold mb-6 shadow-lg">
              নতুন কালেকশন ২০২৫
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              সেরা মানের পণ্য <br/> সাশ্রয়ী দামে।
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-lg font-medium">
              ফ্যাশন, ইলেকট্রনিক্স এবং নিত্যপ্রয়োজনীয় সব পণ্য কিনুন নিশ্চিন্তে। আমাদের এফিলিয়েট প্রোগ্রামে যোগ দিয়ে আয় করুন ঘরে বসেই।
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-900/50 flex items-center justify-center transform hover:-translate-y-1">
                কেনাকাটা শুরু করুন <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <Link to="/affiliate" className="px-8 py-4 bg-white text-red-900 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg flex items-center justify-center transform hover:-translate-y-1">
                এফিলিয়েট হোন
              </Link>
            </div>
          </div>
        </div>
        
        {/* Curved Bottom Shape */}
        <div className="absolute bottom-0 left-0 right-0">
           <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M0 120L1440 120L1440 0C1440 0 1082.5 97 720 97C357.5 97 0 0 0 0L0 120Z" fill="#f9fafb"/>
           </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Truck size={24} />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">দ্রুত ডেলিভারি</h3>
            <p className="text-gray-600">সারা বাংলাদেশে দ্রুততম সময়ে হোম ডেলিভারি সুবিধা।</p>
          </div>
          <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">নিরাপদ পেমেন্ট</h3>
            <p className="text-gray-600">বিকাশ, নগদ এবং ক্যাশ অন ডেলিভারির মাধ্যমে নিরাপদ পেমেন্ট।</p>
          </div>
          <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Zap size={24} />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">সেরা অফার</h3>
            <p className="text-gray-600">নিয়মিত ডিসকাউন্ট এবং ধামাকা অফার উপভোগ করুন।</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">জনপ্রিয় পণ্য</h2>
            <p className="text-gray-500 mt-2 pl-4">আপনার পছন্দের সব কালেকশন</p>
          </div>
          <Link to="/categories" className="hidden md:flex items-center text-red-600 font-semibold hover:text-red-800 transition-colors bg-red-50 px-4 py-2 rounded-full">
            সব দেখুন <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">কোনো পণ্য পাওয়া যায়নি। শীঘ্রই আসছে!</p>
          </div>
        )}
        
        <div className="mt-12 md:hidden text-center">
           <Link to="/categories" className="inline-flex items-center justify-center w-full px-6 py-3 border border-red-600 text-red-600 font-bold rounded-full hover:bg-red-50 transition-colors">
            সব পণ্য দেখুন <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </section>
      
      {/* Affiliate CTA */}
      <section className="relative bg-red-900 text-white py-20 px-4 overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="currentColor"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#dots)"/>
            </svg>
         </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">আমাদের সাথে আয় করুন</h2>
          <p className="text-red-100 mb-10 text-lg leading-relaxed">
            আমাদের এফিলিয়েট প্রোগ্রামে জয়েন করুন এবং প্রতিটি সেলে কমিশন জিতে নিন। 
            হাজারো মানুষ আমাদের সাথে কাজ করে স্বাবলম্বী হচ্ছেন।
          </p>
          <Link to="/affiliate" className="inline-block px-10 py-4 bg-white text-red-700 rounded-full font-bold text-lg hover:bg-red-50 transition-all transform hover:scale-105 shadow-2xl">
            আজই জয়েন করুন
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;