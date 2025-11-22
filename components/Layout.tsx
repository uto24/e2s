import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Menu, ShoppingBag, Home, Search, User, X, LogOut, LayoutDashboard, BarChart2 } from 'lucide-react';
import { useCart, useAuth } from '../services/store';
import { APP_NAME } from '../constants';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center cursor-pointer">
            <div className="flex-shrink-0 flex items-center text-indigo-600">
              <ShoppingBag className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl tracking-tight">{APP_NAME}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Shop</Link>
            <Link to="/categories" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Categories</Link>
            
            {user?.role === UserRole.AFFILIATE && (
              <Link to="/affiliate" className="text-indigo-600 font-medium flex items-center">
                <BarChart2 size={18} className="mr-1" />
                Dashboard
              </Link>
            )}
             {user?.role === UserRole.ADMIN && (
              <Link to="/admin" className="text-red-600 font-medium flex items-center">
                <LayoutDashboard size={18} className="mr-1" />
                Admin
              </Link>
            )}
            
            <div className="flex items-center space-x-4 ml-4">
              <Link to="/cart" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingBag size={24} />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600">
                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" />
                    <span className="font-medium">{user.name}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">{user.email}</div>
                      <button onClick={() => logout()} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
             <Link to="/cart" className="relative p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingBag size={24} />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Shop</Link>
            {user?.role === UserRole.AFFILIATE && (
              <Link to="/affiliate" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 bg-indigo-50">Affiliate Dashboard</Link>
            )}
             {user?.role === UserRole.ADMIN && (
              <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-red-600 bg-red-50">Admin Panel</Link>
            )}
            
            {!user ? (
               <Link to="/login" className="block w-full text-center px-3 py-2 rounded border text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">Sign In / Register</Link>
            ) : (
              <>
                <div className="px-3 py-2 text-sm text-gray-500">Signed in as {user.email}</div>
                <button onClick={() => logout()} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Sign out</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const MobileNav: React.FC = () => {
  const activeClass = "text-indigo-600";
  const inactiveClass = "text-gray-400 hover:text-gray-500";

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/cart', icon: ShoppingBag, label: 'Cart' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 pb-4">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center w-full h-full justify-center ${isActive ? activeClass : inactiveClass}`
            }
          >
            <item.icon size={24} />
            <span className="text-[10px] mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pb-20 md:pb-0">
        {children}
      </main>
      <footer className="bg-gray-900 text-white py-12 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{APP_NAME}</h3>
            <p className="text-gray-400 text-sm">The best marketplace for everything you need. Join our affiliate program and earn today.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white">New Arrivals</Link></li>
              <li><Link to="/" className="hover:text-white">Best Sellers</Link></li>
              <li><Link to="/" className="hover:text-white">Discount</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white">About Us</Link></li>
              <li><Link to="/" className="hover:text-white">Careers</Link></li>
              <li><Link to="/affiliate" className="hover:text-white">Affiliates</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white">Contact</Link></li>
              <li><Link to="/" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/" className="hover:text-white">Shipping</Link></li>
            </ul>
          </div>
        </div>
      </footer>
      <MobileNav />
    </div>
  );
};

export default Layout;