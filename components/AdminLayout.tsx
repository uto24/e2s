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
import { APP_NAME } from '../constants';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Quick check for admin access (also handled in App.tsx routes)
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2 text-gray-600">You do not have permission to view this area.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-slate-950">
          <Link to="/" className="text-xl font-bold tracking-wider">E2S ADMIN</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center space-x-3 mb-6 p-3 bg-slate-800 rounded-lg">
            <img src={user.avatar} alt="Admin" className="w-10 h-10 rounded-full border-2 border-indigo-500" />
            <div>
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg' 
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

        <div className="absolute bottom-0 w-full p-4 bg-slate-950">
          <button 
            onClick={() => logout()} 
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-900 rounded-md transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 z-40 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <Menu size={24} />
          </button>

          <div className="flex-1 max-w-xl ml-4 lg:ml-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search global data..."
              />
            </div>
          </div>

          <div className="ml-4 flex items-center space-x-4">
            <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              <Bell size={20} />
            </button>
            <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View Live Shop
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;