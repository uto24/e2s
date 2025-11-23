import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Menu, ShoppingBag, Home, Search, User, X, LogOut, LayoutDashboard, BarChart2, Tag, Info, Phone } from 'lucide-react';
import { useCart, useAuth } from '../services/store';
import { APP_NAME } from '../constants';
import { UserRole } from '../types';
import { FloatingChatWidget } from './Widgets';

const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center cursor-pointer group">
            <div className="flex-shrink-0 flex items-center text-green-600 group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-8 w-8 mr-2" />
              <span className="font-bold text-2xl tracking-tight font-serif">{APP_NAME}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium transition-colors text-lg">হোম</Link>
            <Link to="/categories" className="text-gray-700 hover:text-green-600 font-medium transition-colors text-lg">ক্যাটাগরি</Link>
            <Link to="/offers" className="text-red-500 hover:text-red-700 font-medium transition-colors text-lg flex items-center"><Tag size={16} className="mr-1"/> অফার</Link>
            
            {user?.role === UserRole.AFFILIATE && (
              <Link to="/affiliate" className="text-green-600 font-medium flex items-center bg-green-50 px-3 py-1 rounded-full hover:bg-green-100 transition-colors">
                <BarChart2 size={18} className="mr-1" />
                ড্যাশবোর্ড
              </Link>
            )}
             {user?.role === UserRole.ADMIN && (
              <Link to="/admin" className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-full font-medium flex items-center transition-colors shadow-md">
                <LayoutDashboard size={18} className="mr-1" />
                অ্যাডমিন
              </Link>
            )}
            
            <div className="flex items-center space-x-4 ml-4">
              <Link to="/cart" className="relative p-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-full transition-all duration-300">
                <ShoppingBag size={26} />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-green-600 rounded-full animate-pulse-soft">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors">
                    <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-full border-2 border-green-100" />
                    <span className="font-medium hidden lg:block">{user.name}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-green-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">{user.email}</div>
                      <Link to="/profile" className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        <User size={16} className="mr-2" /> প্রোফাইল
                      </Link>
                      <button onClick={() => logout()} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        <LogOut size={16} className="mr-2" />
                        লগ আউট
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 shadow-lg shadow-green-200 hover:shadow-green-300 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  লগ ইন
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
             <Link to="/cart" className="relative p-2 mr-2 text-gray-600 hover:bg-green-50 rounded-full transition-colors">
                <ShoppingBag size={24} />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-green-600 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-green-100 animate-slide-up h-screen overflow-y-auto pb-20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">হোম</Link>
            <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">ক্যাটাগরি</Link>
            <Link to="/offers" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-red-500 hover:bg-red-50">অফার</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">আমাদের সম্পর্কে</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50">যোগাযোগ</Link>
            
            {user?.role === UserRole.AFFILIATE && (
              <Link to="/affiliate" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-green-600 bg-green-50">এফিলিয়েট ড্যাশবোর্ড</Link>
            )}
             {user?.role === UserRole.ADMIN && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-white bg-green-600">অ্যাডমিন প্যানেল</Link>
            )}
            
            {!user ? (
               <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-3 py-3 rounded-lg text-base font-medium bg-green-600 text-white hover:bg-green-700 mt-4">লগ ইন / রেজিস্টার</Link>
            ) : (
              <>
                <div className="px-3 py-2 text-sm text-gray-500 mt-2 border-t border-gray-100">লগ ইন করা হয়েছে: {user.email}</div>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-green-600">প্রোফাইল</Link>
                <button onClick={() => {logout(); setIsMenuOpen(false);}} className="block w-full text-left px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50">লগ আউট</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const MobileNav: React.FC = () => {
  const activeClass = "text-green-600 scale-110";
  const inactiveClass = "text-gray-400 hover:text-gray-500";

  const navItems = [
    { path: '/', icon: Home, label: 'হোম' },
    { path: '/categories', icon: Search, label: 'খুঁজুন' },
    { path: '/cart', icon: ShoppingBag, label: 'কার্ট' },
    { path: '/profile', icon: User, label: 'প্রোফাইল' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 pb-safe rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? activeClass : inactiveClass}`
            }
          >
            <item.icon size={24} className="mb-1" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      <main className="flex-grow pb-24 md:pb-0">
        {children}
      </main>
      
      {/* Floating Widgets */}
      <FloatingChatWidget />

      <footer className="bg-gray-900 text-white py-12 hidden md:block mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-green-500">{APP_NAME}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">আপনার সব প্রয়োজনীয় পণ্য এবং এফিলিয়েট আয়ের সেরা প্ল্যাটফর্ম। আজই জয়েন করুন।</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">শপ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/categories" className="hover:text-green-400 transition-colors">নতুন কালেকশন</Link></li>
              <li><Link to="/offers" className="hover:text-green-400 transition-colors text-red-400">স্পেশাল অফার</Link></li>
              <li><Link to="/categories" className="hover:text-green-400 transition-colors">ডিসকাউন্ট</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">কোম্পানি</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-green-400 transition-colors">আমাদের সম্পর্কে</Link></li>
              <li><Link to="/affiliate" className="hover:text-green-400 transition-colors">এফিলিয়েট প্রোগ্রাম</Link></li>
              <li><Link to="/contact" className="hover:text-green-400 transition-colors">শর্তাবলী</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">সহায়তা</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/contact" className="hover:text-green-400 transition-colors">যোগাযোগ</Link></li>
              <li><Link to="/contact" className="hover:text-green-400 transition-colors">শিপিং পলিসি</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; 2025 {APP_NAME}. সর্বস্বত্ব সংরক্ষিত।
        </div>
      </footer>
      <MobileNav />
    </div>
  );
};

export default Layout;