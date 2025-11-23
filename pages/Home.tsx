import React, { useEffect, useState } from 'react';
import { ArrowRight, Zap, ShieldCheck, Truck, Star, Clock, Mail, Gift, Smartphone, Shirt, Home as HomeIcon, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useShop } from '../services/store';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { products, settings } = useShop();
  const featuredProducts = products.slice(0, 8);
  
  // Countdown timer logic for campaign
  const [timeLeft, setTimeLeft] = useState<{hours: number, minutes: number, seconds: number}>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
      if (settings.campaign?.isActive && settings.campaign.endTime) {
          const interval = setInterval(() => {
              const now = new Date().getTime();
              const distance = new Date(settings.campaign.endTime).getTime() - now;
              
              if (distance < 0) {
                  clearInterval(interval);
                  setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
              } else {
                  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + Math.floor(distance / (1000 * 60 * 60 * 24)) * 24;
                  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                  setTimeLeft({ hours, minutes, seconds });
              }
          }, 1000);
          return () => clearInterval(interval);
      }
  }, [settings.campaign]);

  if (settings.maintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
        <div className="max-w-md w-full text-center animate-pulse-soft">
          <Zap size={64} className="mx-auto text-green-600 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">রক্ষণাবেক্ষণের কাজ চলছে</h1>
          <p className="text-gray-600">আমরা বর্তমানে কিছু জরুরি আপডেটের কাজ করছি। শীঘ্রই ফিরে আসছি।</p>
        </div>
      </div>
    );
  }

  const categories = [
    { name: "ইলেকট্রনিক্স", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
    { name: "ফ্যাশন", icon: Shirt, color: "bg-pink-100 text-pink-600" },
    { name: "হোম ও লিভিং", icon: HomeIcon, color: "bg-green-100 text-green-600" },
    { name: "বিউটি", icon: Sparkles, color: "bg-purple-100 text-purple-600" }
  ];

  return (
    <div className="animate-fade-in overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-950 text-white overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover animate-pulse-soft"
          />
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500 opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="md:w-3/4 lg:w-2/3 animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-8 shadow-lg">
              <Sparkles size={16} className="mr-2 text-yellow-400" /> নতুন কালেকশন ২০২৫
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight drop-shadow-lg">
              সেরা মানের পণ্য, <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">সাশ্রয়ী দামে।</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl font-medium leading-relaxed shadow-black">
              ফ্যাশন, ইলেকট্রনিক্স এবং নিত্যপ্রয়োজনীয় সব পণ্য কিনুন নিশ্চিন্তে। আমাদের এফিলিয়েট প্রোগ্রামে যোগ দিয়ে আয় করুন ঘরে বসেই।
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/categories" className="px-10 py-4 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-900/50 flex items-center justify-center transform hover:scale-105">
                কেনাকাটা করুন <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/affiliate" className="px-10 py-4 bg-white text-green-900 rounded-full font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg flex items-center justify-center transform hover:scale-105">
                এফিলিয়েট হোন
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <div className="bg-white border-b border-gray-100 relative z-30 -mt-8 mx-4 md:mx-8 rounded-xl shadow-lg lg:max-w-7xl lg:mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center space-x-4 hover:bg-green-50 p-4 rounded-lg transition-colors cursor-pointer">
          <div className="bg-green-100 p-3 rounded-full text-green-600"><Truck size={24} /></div>
          <div>
            <h3 className="font-bold text-gray-900">দ্রুত ডেলিভারি</h3>
            <p className="text-sm text-gray-500">২৪-৪৮ ঘন্টার মধ্যে ডেলিভারি</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 hover:bg-green-50 p-4 rounded-lg transition-colors cursor-pointer">
           <div className="bg-green-100 p-3 rounded-full text-green-600"><ShieldCheck size={24} /></div>
          <div>
            <h3 className="font-bold text-gray-900">নিরাপদ পেমেন্ট</h3>
            <p className="text-sm text-gray-500">ক্যাশ অন ডেলিভারি সুবিধা</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 hover:bg-green-50 p-4 rounded-lg transition-colors cursor-pointer">
           <div className="bg-green-100 p-3 rounded-full text-green-600"><Gift size={24} /></div>
          <div>
            <h3 className="font-bold text-gray-900">সেরা অফার</h3>
            <p className="text-sm text-gray-500">আকর্ষণীয় ডিসকাউন্ট ও ডিল</p>
          </div>
        </div>
      </div>

      {/* Shop By Category */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">জনপ্রিয় ক্যাটাগরি</h2>
            <p className="text-gray-500 mt-2">আপনার পছন্দের পণ্য খুঁজে নিন</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link to="/categories" key={idx} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center border border-gray-100 hover:border-green-200">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${cat.color}`}>
                  <cat.icon size={32} />
                </div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-600 transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Banner - Updated Design */}
      {settings.campaign?.isActive && (
          <section className="py-12 my-8 mx-4 sm:mx-0">
             <div 
               className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl relative transition-all hover:shadow-green-900/20"
               style={{ 
                 background: `linear-gradient(120deg, ${settings.campaign.gradientFrom || '#0f172a'} 0%, ${settings.campaign.gradientTo || '#334155'} 100%)`
               }}
             >
                {/* Modern Abstract Pattern */}
                <div className="absolute inset-0 opacity-10">
                   <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                   </svg>
                </div>
                
                {/* Glowing Effect */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 px-6 py-16 md:p-20 flex flex-col md:flex-row items-center justify-between">
                   <div className="text-center md:text-left text-white mb-10 md:mb-0 max-w-2xl">
                      <div className="inline-flex items-center bg-red-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-red-500/30 text-red-200 animate-pulse">
                         <Clock size={16} className="mr-2"/> সীমিত সময়ের জন্য
                      </div>
                      <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-sm">{settings.campaign.title}</h2>
                      <p className="text-xl text-gray-200 opacity-90 leading-relaxed">{settings.campaign.subtitle}</p>
                   </div>
                   
                   <div className="flex flex-col items-center bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-inner">
                      <p className="text-sm uppercase tracking-widest text-gray-300 mb-4 font-semibold">অফার শেষ হবে</p>
                      <div className="flex space-x-3 text-center mb-8">
                        {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((time, i) => (
                          <div key={i} className="bg-gray-900/60 backdrop-blur-md border border-gray-600 text-white rounded-xl p-4 w-20 shadow-lg flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold font-mono block leading-none mb-1">{String(time).padStart(2, '0')}</span>
                            <span className="text-[10px] uppercase font-medium tracking-wider text-gray-400">{['ঘন্টা', 'মিনিট', 'সেকেন্ড'][i]}</span>
                          </div>
                        ))}
                      </div>
                      <Link 
                        to="/offers" 
                        className="w-full bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-400 hover:text-green-950 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center"
                      >
                         শপিং শুরু করুন <ArrowRight className="ml-2" />
                      </Link>
                   </div>
                </div>
             </div>
          </section>
      )}

      {/* Featured Products */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-green-600 pl-3">ট্রেন্ডিং পণ্য</h2>
            <p className="text-gray-500 mt-2 pl-4">সবার পছন্দের তালিকায় শীর্ষে</p>
          </div>
          <Link to="/categories" className="hidden md:flex items-center text-green-600 font-semibold hover:text-green-800 transition-colors bg-green-50 px-4 py-2 rounded-full">
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
           <Link to="/categories" className="inline-flex items-center justify-center w-full px-6 py-3 border border-green-600 text-green-600 font-bold rounded-full hover:bg-green-50 transition-colors">
            সব পণ্য দেখুন <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">আমাদের নিউজলেটার সাবস্ক্রাইব করুন</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">নতুন পণ্য এবং অফার সম্পর্কে সবার আগে জানতে আমাদের সাথে যুক্ত থাকুন।</p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="আপনার ইমেইল অ্যাড্রেস" 
              className="flex-1 px-5 py-3 rounded-full bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-green-500"
            />
            <button type="button" className="px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-colors">
              সাবস্ক্রাইব
            </button>
          </form>
        </div>
      </section>
      
      {/* Affiliate CTA */}
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20 px-4 overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="currentColor"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#dots)"/>
            </svg>
         </div>
        <div className="relative max-w-4xl mx-auto text-center animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">আমাদের সাথে আয় করুন</h2>
          <p className="text-white/90 mb-10 text-lg leading-relaxed max-w-2xl mx-auto">
            আমাদের এফিলিয়েট প্রোগ্রামে জয়েন করুন এবং প্রতিটি সেলে কমিশন জিতে নিন। 
            হাজারো মানুষ আমাদের সাথে কাজ করে স্বাবলম্বী হচ্ছেন। কোনো বিনিয়োগ ছাড়াই শুরু করুন।
          </p>
          <Link to="/affiliate" className="inline-block px-10 py-4 bg-white text-green-600 rounded-full font-bold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl">
            আজই জয়েন করুন
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;