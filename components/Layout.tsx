import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { Menu, ShoppingBag, Home, Search, User, X, LogOut, LayoutDashboard, BarChart2, Tag, Info, Phone, Facebook, Twitter, Instagram, Mail, MapPin } from 'lucide-react';
import { useCart, useAuth, useShop } from '../services/store';
import { APP_NAME } from '../constants';
import { UserRole } from '../types';
import { FloatingChatWidget } from './Widgets';

const PromotionalPopup: React.FC = () => {
    const { settings } = useShop();
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Show popup after 2 seconds if active and settings loaded
        if (settings.popup?.isActive) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [settings.popup]);

    if (!isVisible || !settings.popup?.isActive) return null;

    const handleClose = () => setIsVisible(false);
    const handleAction = () => {
        setIsVisible(false);
        navigate(settings.popup.link || '/offers');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={handleClose}></div>
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full relative z-10 overflow-hidden animate-slide-up transform transition-all">
                <button 
                    onClick={handleClose} 
                    className="absolute top-3 right-3 p-2 bg-black/10 hover:bg-black/20 text-gray-800 rounded-full transition-colors z-20 backdrop-blur-sm"
                >
                    <X size={18} />
                </button>
                <div 
                    className="h-56 bg-gray-200 bg-cover bg-center relative" 
                    style={{ backgroundImage: `url(${settings.popup.image})` }}
                >
                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                     <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="bg-green-500 text-xs font-bold px-2 py-1 rounded text-white mb-2 inline-block">স্পেশাল অফার</span>
                        <h3 className="text-xl font-bold leading-tight shadow-black drop-shadow-md">{settings.popup.title}</h3>
                     </div>
                </div>
                <div className="p-6">
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">আমাদের নতুন কালেকশন এবং ধামাকা অফার মিস করবেন না! সীমিত সময়ের জন্য প্রযোজ্য।</p>
                    <button 
                        onClick={handleAction}
                        className="w-full py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center group"
                    >
                        বিস্তারিত দেখুন <Tag size={16} className="ml-2 group-hover:rotate-12 transition-transform"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center cursor-pointer group">
            <div className="flex-shrink-0 flex items-center text-green-600 group-hover:scale-105 transition-transform">
              <div className="bg-gradient-to-tr from-green-500 to-emerald-400 text-white p-1.5 rounded-lg mr-2 shadow-lg shadow-green-200">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight font-sans text-slate-800">{APP_NAME}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink to="/" className={({isActive}) => `font-medium transition-colors text-[15px] ${isActive ? 'text-green-600 font-bold' : 'text-slate-600 hover:text-green-600'}`}>হোম</NavLink>
            <NavLink to="/categories" className={({isActive}) => `font-medium transition-colors text-[15px] ${isActive ? 'text-green-600 font-bold' : 'text-slate-600 hover:text-green-600'}`}>ক্যাটাগরি</NavLink>
            <NavLink to="/offers" className={({isActive}) => `font-medium transition-colors text-[15px] flex items-center ${isActive ? 'text-red-600 font-bold' : 'text-red-500 hover:text-red-700'}`}>
               <Tag size={14} className="mr-1"/> অফার
            </NavLink>
            
            {user?.role === UserRole.AFFILIATE && (
              <Link to="/affiliate" className="text-green-600 font-medium flex items-center bg-green-50 px-4 py-1.5 rounded-full hover:bg-green-100 transition-colors border border-green-100">
                <BarChart2 size={16} className="mr-1.5" />
                ড্যাশবোর্ড
              </Link>
            )}
             {user?.role === UserRole.ADMIN && (
              <Link to="/admin" className="text-white bg-slate-800 hover:bg-slate-900 px-4 py-1.5 rounded-full font-medium flex items-center transition-colors shadow-md">
                <LayoutDashboard size={16} className="mr-1.5" />
                অ্যাডমিন
              </Link>
            )}
            
            <div className="flex items-center space-x-3 ml-4">
              <Link to="/cart" className="relative p-2 text-slate-600 hover:bg-green-50 hover:text-green-600 rounded-full transition-all duration-300 group">
                <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform bg-green-500 rounded-full shadow-md animate-pulse-soft">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 pl-2 pr-1 rounded-full border border-transparent hover:border-gray-200 hover:bg-white transition-all">
                    <span className="font-semibold text-sm text-slate-700 hidden lg:block">{user.name.split(' ')[0]}</span>
                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200 object-cover shadow-sm" />
                  </button>
                  <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 overflow-hidden z-50">
                    <div className="p-3">
                      <div className="px-3 py-2 text-xs text-gray-400 uppercase font-bold tracking-wider">{user.role}</div>
                      <Link to="/profile" className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">
                        <User size={16} className="mr-2" /> প্রোফাইল
                      </Link>
                      <button onClick={() => logout()} className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1">
                        <LogOut size={16} className="mr-2" />
                        লগ আউট
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="px-6 py-2 text-sm font-bold text-white bg-green-600 rounded-full hover:bg-green-700 shadow-lg shadow-green-200 hover:shadow-green-300 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  লগ ইন
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
             <Link to="/cart" className="relative p-2 mr-1 text-slate-600 hover:bg-green-50 rounded-full transition-colors">
                <ShoppingBag size={24} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform bg-green-500 rounded-full shadow-sm">
                    {itemCount}
                  </span>
                )}
              </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-green-600 hover:bg-green-50 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 animate-slide-up shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link to="/" className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-green-600 hover:bg-green-50 transition-colors">হোম</Link>
            <Link to="/categories" className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-green-600 hover:bg-green-50 transition-colors">ক্যাটাগরি</Link>
            <Link to="/offers" className="block px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center"><Tag size={16} className="mr-2"/> অফার</Link>
            <Link to="/about" className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-green-600 hover:bg-green-50 transition-colors">আমাদের সম্পর্কে</Link>
            <Link to="/contact" className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-green-600 hover:bg-green-50 transition-colors">যোগাযোগ</Link>
            
            {user?.role === UserRole.AFFILIATE && (
              <Link to="/affiliate" className="block px-4 py-3 rounded-xl text-base font-medium text-green-700 bg-green-50 border border-green-100">এফিলিয়েট ড্যাশবোর্ড</Link>
            )}
             {user?.role === UserRole.ADMIN && (
              <Link to="/admin" className="block px-4 py-3 rounded-xl text-base font-medium text-white bg-slate-800">অ্যাডমিন প্যানেল</Link>
            )}
            
            {!user ? (
               <Link to="/login" className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold bg-green-600 text-white hover:bg-green-700 mt-4 shadow-lg shadow-green-200">লগ ইন / রেজিস্টার</Link>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center px-4 mb-4">
                    <img src={user.avatar} className="w-10 h-10 rounded-full border border-gray-200 mr-3" />
                    <div>
                        <p className="font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                </div>
                <Link to="/profile" className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-gray-50">প্রোফাইল</Link>
                <button onClick={() => logout()} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50">লগ আউট</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const MobileNav: React.FC = () => {
  const activeClass = "text-green-600 -translate-y-1";
  const inactiveClass = "text-gray-400 hover:text-gray-600";

  const navItems = [
    { path: '/', icon: Home, label: 'হোম' },
    { path: '/categories', icon: Search, label: 'খুঁজুন' },
    { path: '/cart', icon: ShoppingBag, label: 'কার্ট' },
    { path: '/profile', icon: User, label: 'প্রোফাইল' },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-lg border border-white/20 z-50 rounded-2xl shadow-xl shadow-gray-200/50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? activeClass : inactiveClass}`
            }
          >
            <item.icon size={24} className={`mb-1 transition-transform ${item.label === 'কার্ট' ? '' : ''}`} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = useLocation().pathname;
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-green-100 selection:text-green-800">
      <PromotionalPopup />
      <Navbar />
      <main className={`flex-grow ${!isHome ? 'pt-20' : ''} pb-24 md:pb-0`}>
        {children}
      </main>
      
      {/* Floating Widgets */}
      <FloatingChatWidget />

      <footer className="bg-slate-900 text-white pt-20 pb-10 hidden md:block mt-20 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div className="space-y-6">
                    <div className="flex items-center">
                         <div className="bg-green-500 text-white p-1.5 rounded-lg mr-2">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-white">{APP_NAME}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        আপনার বিশ্বস্ত অনলাইন শপিং পার্টনার। সেরা পণ্য, দ্রুত ডেলিভারি এবং নিরাপদ পেমেন্ট। আমাদের এফিলিয়েট প্রোগ্রামে জয়েন করে আয় করুন।
                    </p>
                    <div className="flex space-x-4 pt-2">
                        <a href="#" className="bg-slate-800 hover:bg-green-600 p-2 rounded-full transition-colors text-white"><Facebook size={18}/></a>
                        <a href="#" className="bg-slate-800 hover:bg-sky-500 p-2 rounded-full transition-colors text-white"><Twitter size={18}/></a>
                        <a href="#" className="bg-slate-800 hover:bg-pink-600 p-2 rounded-full transition-colors text-white"><Instagram size={18}/></a>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-lg mb-6 text-white">কুইক লিংকস</h4>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li><Link to="/" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>হোম</Link></li>
                        <li><Link to="/categories" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>সব ক্যাটাগরি</Link></li>
                        <li><Link to="/offers" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>অফার এবং ডিলস</Link></li>
                        <li><Link to="/affiliate" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>এফিলিয়েট প্রোগ্রাম</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-lg mb-6 text-white">গ্রাহক সেবা</h4>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li><Link to="/profile" className="hover:text-green-400 transition-colors">আমার অ্যাকাউন্ট</Link></li>
                        <li><Link to="/contact" className="hover:text-green-400 transition-colors">যোগাযোগ</Link></li>
                        <li><Link to="/contact" className="hover:text-green-400 transition-colors">রিটার্ন পলিসি</Link></li>
                        <li><Link to="/contact" className="hover:text-green-400 transition-colors">প্রাইভেসি পলিসি</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-lg mb-6 text-white">যোগাযোগ</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li className="flex items-start">
                            <MapPin size={18} className="mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>লেভেল ৪, যমুনা ফিউচার পার্ক,<br/>ঢাকা-১২২৯</span>
                        </li>
                        <li className="flex items-center">
                            <Phone size={18} className="mr-3 text-green-500 flex-shrink-0" />
                            <span>+৮৮০ ১৭১০-০০০০০০</span>
                        </li>
                        <li className="flex items-center">
                            <Mail size={18} className="mr-3 text-green-500 flex-shrink-0" />
                            <span>support@e2s-shop.com</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                <p>&copy; 2025 {APP_NAME}. সর্বস্বত্ব সংরক্ষিত।</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <span>Terms of Service</span>
                    <span>Privacy Policy</span>
                </div>
            </div>
        </div>
      </footer>
      <MobileNav />
    </div>
  );
};

export default Layout;