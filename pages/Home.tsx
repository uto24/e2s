import React, { useEffect, useState } from 'react';
import { ArrowRight, Zap, ShieldCheck, Truck, Clock, Mail, Gift, Smartphone, Shirt, Home as HomeIcon, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useShop } from '../services/store';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { products, settings } = useShop();
  const featuredProducts = products.slice(0, 8);
  
  // Countdown timer logic
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full text-center animate-pulse-glow">
          <Zap size={64} className="mx-auto text-green-600 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">রক্ষণাবেক্ষণের কাজ চলছে</h1>
          <p className="text-gray-600">আমরা বর্তমানে কিছু জরুরি আপডেটের কাজ করছি। শীঘ্রই ফিরে আসছি।</p>
        </div>
      </div>
    );
  }

  const categories = [
    { name: "ইলেকট্রনিক্স", icon: Smartphone, color: "bg-blue-50 text-blue-600", image: "https://images.unsplash.com/photo-1498049381945-a0d5eb32c301?auto=format&fit=crop&w=500&q=60" },
    { name: "ফ্যাশন", icon: Shirt, color: "bg-pink-50 text-pink-600", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=60" },
    { name: "হোম ও লিভিং", icon: HomeIcon, color: "bg-orange-50 text-orange-600", image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=500&q=60" },
    { name: "বিউটি", icon: Sparkles, color: "bg-purple-50 text-purple-600", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=500&q=60" }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Modern Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-slate-900 overflow-hidden">
         {/* Background Elements */}
         <div className="absolute inset-0 z-0">
             <img 
               src="https://i.ibb.co/jvvchx4k/cozy-portrait-young-woman-knitted-blue-sweater-bright-pink-makeup-holding-shopping-bags-mobile-phone.jpg" 
               alt="Hero BG" 
               className="w-full h-full object-cover opacity-30"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
         </div>
         
         <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-green-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-float"></div>
         <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-float" style={{animationDelay: '2s'}}></div>

         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
            <div className="max-w-3xl animate-slide-up">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-green-400 text-sm font-bold mb-8 shadow-lg">
                    <Sparkles size={16} className="mr-2" /> নতুন কালেকশন ২০২৫
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
                    স্টাইল এবং টেকনোলজির <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">অপূর্ব সংমিশ্রণ।</span>
                </h1>
                <p className="text-xl text-slate-300 mb-10 leading-relaxed font-light max-w-2xl">
                    দেশসেরা ই-কমার্স প্ল্যাটফর্মে আপনাকে স্বাগতম। আধুনিক সব পণ্য এবং আকর্ষণীয় অফার উপভোগ করতে আজই শপিং শুরু করুন।
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/categories" className="px-8 py-4 bg-green-600 text-white rounded-full font-bold text-lg hover:bg-green-500 transition-all duration-300 shadow-lg shadow-green-900/50 hover:shadow-green-500/30 flex items-center justify-center transform hover:-translate-y-1">
                        কেনাকাটা করুন <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link to="/affiliate" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1">
                        এফিলিয়েট প্রোগ্রাম
                    </Link>
                </div>
            </div>
         </div>
      </section>

      {/* Stats/Features Strip */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border border-gray-100 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {[
                { icon: Truck, title: "দ্রুত ডেলিভারি", desc: "২৪-৪৮ ঘন্টার মধ্যে ডেলিভারি", color: "text-blue-500", bg: "bg-blue-50" },
                { icon: ShieldCheck, title: "নিরাপদ পেমেন্ট", desc: "১০০% সিকিউর পেমেন্ট গেটওয়ে", color: "text-green-500", bg: "bg-green-50" },
                { icon: Gift, title: "এক্সক্লুসিভ অফার", desc: "প্রতিদিন নতুন নতুন ডিসকাউন্ট", color: "text-purple-500", bg: "bg-purple-50" },
            ].map((feature, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-default">
                    <div className={`p-4 rounded-full ${feature.bg} ${feature.color}`}>
                        <feature.icon size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{feature.title}</h3>
                        <p className="text-sm text-gray-500">{feature.desc}</p>
                    </div>
                </div>
            ))}
          </div>
      </div>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <span className="text-green-600 font-bold tracking-wider uppercase text-sm">এক্সপ্লোর করুন</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">জনপ্রিয় ক্যাটাগরি</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((cat, idx) => (
                    <Link to="/categories" key={idx} className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500">
                        <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center mb-3 bg-white`}>
                                <cat.icon size={20} />
                            </div>
                            <h3 className="font-bold text-xl">{cat.name}</h3>
                            <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 flex items-center">
                                দেখুন <ChevronRight size={14} className="ml-1" />
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      {settings.campaign?.isActive && (
          <section className="py-10 px-4">
             <div 
               className="max-w-7xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl relative transition-all"
               style={{ 
                 background: `linear-gradient(135deg, ${settings.campaign.gradientFrom || '#0f172a'} 0%, ${settings.campaign.gradientTo || '#334155'} 100%)`
               }}
             >
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-[120px]"></div>

                <div className="relative z-10 px-6 py-16 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12">
                   <div className="text-center lg:text-left text-white max-w-2xl">
                      <div className="inline-flex items-center bg-red-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-red-500/30 text-red-200 animate-pulse-glow">
                         <Clock size={16} className="mr-2"/> সীমিত সময়ের অফার
                      </div>
                      <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">{settings.campaign.title}</h2>
                      <p className="text-xl text-gray-200 opacity-90 leading-relaxed font-light">{settings.campaign.subtitle}</p>
                   </div>
                   
                   <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md">
                      <p className="text-center text-gray-200 uppercase tracking-widest text-sm font-bold mb-6">অফার শেষ হবে</p>
                      <div className="flex justify-center space-x-4 mb-8">
                        {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((time, i) => (
                          <div key={i} className="flex flex-col items-center">
                              <div className="bg-slate-900/80 backdrop-blur border border-slate-700 text-white rounded-2xl w-20 h-24 flex items-center justify-center shadow-lg relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                                <span className="text-4xl font-bold font-mono relative z-10">{String(time).padStart(2, '0')}</span>
                              </div>
                              <span className="text-xs uppercase font-bold tracking-wider text-gray-300 mt-2">{['ঘন্টা', 'মিনিট', 'সেকেন্ড'][i]}</span>
                          </div>
                        ))}
                      </div>
                      <Link 
                        to="/offers" 
                        className="block w-full bg-white text-slate-900 py-4 rounded-xl font-bold text-center text-lg hover:bg-green-400 transition-all hover:scale-[1.02] shadow-xl"
                      >
                         শপিং শুরু করুন
                      </Link>
                   </div>
                </div>
             </div>
          </section>
      )}

      {/* Featured Products */}
      {/* Featured Products */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          
          <div className="w-full text-center md:text-left">
            
            <div className="flex items-center justify-center md:justify-start text-green-600 font-bold tracking-wider uppercase text-sm mb-2">
                <TrendingUp size={18} className="mr-2" /> ট্রেন্ডিং
            </div>
            <h2 className="text-4xl font-bold text-gray-900">জনপ্রিয় পণ্য</h2>
          </div>
          
          <Link 
            to="/categories" 
            className="flex items-center text-slate-700 font-bold hover:text-green-600 transition-colors border-b-2 border-transparent hover:border-green-600 pb-1 mt-4 mx-auto md:mt-0 md:mx-0"
          >
            সব পণ্য দেখুন <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-lg">কোনো পণ্য পাওয়া যায়নি।</p>
          </div>
        )}
        
        <div className="mt-12 md:hidden text-center">
           <Link to="/categories" className="inline-flex items-center justify-center w-full px-6 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
            সব পণ্য দেখুন
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-green-500/30">
             <Mail size={32} className="text-green-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">নিউজলেটার সাবস্ক্রাইব করুন</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg">নতুন পণ্য এবং অফার সম্পর্কে সবার আগে জানতে আমাদের সাথে যুক্ত থাকুন।</p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="আপনার ইমেইল অ্যাড্রেস" 
              className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
            />
            <button type="button" className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20">
              সাবস্ক্রাইব
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
