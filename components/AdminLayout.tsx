import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../services/store';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2 text-gray-600">You do not have permission to view this area.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Overview' },
    { path: '/admin/products', icon: ShoppingBag, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/affiliates', icon: Users, label: 'Affiliates' },
    { path: '/admin/finance', icon: DollarSign, label: 'Finance & Withdraws' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden font-sans">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 flex flex-col h-full border-r border-slate-800
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-slate-950 shrink-0 shadow-md">
          <Link to="/" className="text-xl font-bold tracking-wider text-green-500">E2S ADMIN</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-4 flex-1 overflow-y-auto">
          <div className="flex items-center space-x-3 mb-6 p-3 bg-slate-800 rounded-lg border border-slate-700">
            <img src={user.avatar} alt="Admin" className="w-10 h-10 rounded-full border-2 border-green-500 object-cover" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' 
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} className="mr-3" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 bg-slate-950 shrink-0 border-t border-slate-800">
          <button 
            onClick={() => logout()} 
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-900 rounded-md transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 z-30 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-1 -ml-2 mr-2"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 lg:hidden">Admin Panel</h1>
          </div>

          <div className="flex-1 max-w-xl ml-4 lg:ml-8 hidden sm:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search global data..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none hover:bg-gray-100 transition-colors">
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white animate-pulse"></span>
              <Bell size={20} />
            </button>
            <Link to="/" className="text-sm font-medium text-green-600 hover:text-green-500 whitespace-nowrap bg-green-50 px-3 py-1 rounded-full">
              View Shop
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;