import React, { useState } from 'react';
import { useAuth } from '../services/store';
import { User, Mail, Shield, Edit2, Save, Package, CreditCard, LogOut, Camera } from 'lucide-react';
import { MOCK_ORDERS, CURRENCY } from '../constants';
import { Navigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: ''
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  if (!user) return <Navigate to="/login" replace />;

  const userOrders = MOCK_ORDERS.filter(o => o.email === user.email);
  const totalSpent = userOrders.reduce((acc, order) => acc + order.total, 0);

  const handleSave = async () => {
    setStatus('saving');
    try {
      await updateUserProfile({ 
        name: formData.name,
        password: formData.password || undefined 
      });
      setStatus('success');
      setIsEditing(false);
      setTimeout(() => setStatus('idle'), 3000);
    } catch (e) {
      setStatus('error');
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Sidebar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit sticky top-24">
            <div className="bg-gradient-to-r from-red-600 to-red-800 h-32 relative"></div>
            <div className="px-6 pb-8 relative text-center">
              <div className="relative inline-block -mt-16 mb-4">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
                />
                <button className="absolute bottom-2 right-2 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors shadow-sm">
                   <Camera size={14} />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 mb-4">{user.email}</p>
              
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                user.role === 'affiliate' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {user.role}
              </span>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-gray-900">{userOrders.length}</span>
                  <span className="text-xs text-gray-500 uppercase font-medium">অর্ডার</span>
                </div>
                <div className="text-center border-l border-gray-100">
                  <span className="block text-2xl font-bold text-red-600">{CURRENCY}{totalSpent.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 uppercase font-medium">মোট খরচ</span>
                </div>
              </div>
              
              <button 
                onClick={() => logout()}
                className="mt-8 w-full py-2 px-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium flex items-center justify-center transition-colors"
              >
                <LogOut size={16} className="mr-2" /> লগ আউট
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <User className="mr-2 text-red-600" /> ব্যক্তিগত তথ্য
                </h3>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Edit2 size={16} className="mr-1" /> এডিট করুন
                  </button>
                ) : (
                  <button 
                    onClick={handleSave}
                    disabled={status === 'saving'}
                    className="flex items-center text-sm text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {status === 'saving' ? 'সেভ হচ্ছে...' : <><Save size={16} className="mr-1" /> সেভ করুন</>}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">পুরো নাম</label>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full p-3 rounded-lg border ${isEditing ? 'border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-transparent bg-gray-50'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      disabled 
                      value={user.email}
                      className="w-full p-3 pl-10 rounded-lg border border-transparent bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>
                {isEditing && (
                   <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">নতুন পাসওয়ার্ড (পরিবর্তন করতে চাইলে দিন)</label>
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                )}
                <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">অ্যাকাউন্ট রোল</label>
                   <div className="flex items-center p-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-800 text-sm font-medium">
                     <Shield size={18} className="mr-2" />
                     {user.role.toUpperCase().replace('_', ' ')} ACCOUNT
                   </div>
                </div>
              </div>
              {status === 'success' && <p className="mt-4 text-sm text-green-600 font-medium">তথ্য আপডেট হয়েছে!</p>}
              {status === 'error' && <p className="mt-4 text-sm text-red-600 font-medium">কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।</p>}
            </div>

            {/* Order History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Package className="mr-2 text-red-600" /> অর্ডারের তালিকা
                </h3>
              </div>
              <div className="overflow-x-auto">
                {userOrders.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অর্ডার আইডি</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">টোটাল</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">পেমেন্ট</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{CURRENCY}{order.total}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                            <CreditCard size={14} className="mr-1" /> {order.paymentMethod}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <Package size={48} className="mx-auto text-gray-300 mb-3" />
                    <p>আপনার কোনো অর্ডার নেই।</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;