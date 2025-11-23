import React, { useState, useEffect } from 'react';
import { useAuth, useShop } from '../services/store';
import { User, Mail, Edit2, Save, Package, CreditCard, LogOut, Camera, Phone, MapPin, Calendar, CheckCircle, Gift, Award, TrendingUp, Clock, Truck, XCircle, RefreshCw } from 'lucide-react';
import { CURRENCY } from '../constants';
import { Navigate } from 'react-router-dom';
import { Order, OrderStatus } from '../types';

const Profile: React.FC = () => {
  const { user, logout, updateUserProfile, loading } = useAuth();
  const { orders, refreshData } = useShop(); 
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    password: ''
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Load latest data on mount to ensure we have "database" data
  useEffect(() => {
    refreshData();
  }, []);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        password: ''
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const userOrders = orders.filter(o => o.email?.toLowerCase() === user.email?.toLowerCase());
  const totalSpent = userOrders.reduce((acc, order) => acc + order.total, 0);

  const handleSave = async () => {
    setStatus('saving');
    try {
      await updateUserProfile({ 
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
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

  const getOrderStatusIcon = (status: OrderStatus) => {
      switch(status) {
          case 'pending': return <Clock size={16} className="text-yellow-600" />;
          case 'processing': return <Award size={16} className="text-blue-600" />;
          case 'shipped': return <Truck size={16} className="text-purple-600" />;
          case 'delivered': return <CheckCircle size={16} className="text-green-600" />;
          case 'cancelled': return <XCircle size={16} className="text-red-600" />;
          default: return <Clock size={16} />;
      }
  };

  const getOrderStatusColor = (status: OrderStatus) => {
      switch(status) {
          case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
          case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
          case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-100';
          case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
          case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
          default: return 'bg-gray-50 text-gray-700';
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12 font-sans animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-600"></div>
          <div className="px-8 pb-8 flex flex-col md:flex-row items-center md:items-end -mt-12 space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
               <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-white" />
               <div className="absolute bottom-0 right-0 p-1.5 bg-gray-800 text-white rounded-full border-2 border-white cursor-pointer hover:bg-gray-700">
                  <Camera size={14} />
               </div>
            </div>
            <div className="flex-1 text-center md:text-left">
               <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
               <div className="flex items-center justify-center md:justify-start text-gray-500 text-sm mt-1">
                  <Mail size={14} className="mr-1" /> {user.email}
                  <span className="mx-2">•</span>
                  <span className="capitalize">{user.role}</span>
               </div>
            </div>
            <div className="flex space-x-3">
               <button onClick={() => logout()} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
                  <LogOut size={16} className="mr-2" /> লগ আউট
               </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-8 flex space-x-6 border-t border-gray-200 overflow-x-auto">
             <button 
                onClick={() => setActiveTab('overview')} 
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
             >
                ওভারভিউ
             </button>
             <button 
                onClick={() => setActiveTab('orders')} 
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'orders' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
             >
                অর্ডার ইতিহাস ({userOrders.length})
             </button>
             <button 
                onClick={() => setActiveTab('settings')} 
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settings' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
             >
                সেটিংস
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
               
               {activeTab === 'overview' && (
                  <div className="animate-fade-in space-y-8">
                      {/* Loyalty Card */}
                      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
                              <div>
                                  <div className="flex items-center space-x-2 mb-2 opacity-90">
                                      <Award className="text-yellow-300" />
                                      <span className="uppercase tracking-wider text-xs font-bold">লয়্যালটি রিওয়ার্ড</span>
                                  </div>
                                  <h2 className="text-4xl font-extrabold mb-1">{user.points || 0} <span className="text-xl font-normal opacity-80">পয়েন্ট</span></h2>
                                  <p className="text-indigo-100 text-sm">প্রতি ১০০ টাকার কেনাকাটায় ১ পয়েন্ট জিতুন!</p>
                              </div>
                              <div className="mt-6 md:mt-0 text-center">
                                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                                      <Gift size={32} className="mx-auto mb-1 text-yellow-300" />
                                      <span className="text-xs font-bold">রিডিম করুন</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-4">
                                  <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                      <Package size={20} />
                                  </div>
                                  <span className="text-xs text-gray-400 font-medium uppercase">মোট অর্ডার</span>
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900">{userOrders.length}</h3>
                              <p className="text-xs text-green-600 flex items-center mt-1">
                                  <TrendingUp size={12} className="mr-1" /> সক্রিয় কাস্টমার
                              </p>
                          </div>
                          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-4">
                                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                      <CreditCard size={20} />
                                  </div>
                                  <span className="text-xs text-gray-400 font-medium uppercase">মোট খরচ</span>
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900">{CURRENCY}{totalSpent.toLocaleString()}</h3>
                              <p className="text-xs text-blue-600 flex items-center mt-1">
                                  <CheckCircle size={12} className="mr-1" /> ভেরিফাইড পেমেন্ট
                              </p>
                          </div>
                      </div>

                      {/* Recent Order Preview */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-gray-900">সর্বশেষ অর্ডার</h3>
                                <button onClick={refreshData} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-green-600" title="Refresh">
                                    <RefreshCw size={14} />
                                </button>
                              </div>
                              <button onClick={() => setActiveTab('orders')} className="text-sm text-green-600 hover:underline">সব দেখুন</button>
                          </div>
                          {userOrders.length > 0 ? (
                              <div className="divide-y divide-gray-100">
                                  {userOrders.slice(0, 3).map(order => (
                                      <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                          <div className="flex items-center space-x-4">
                                              <div className="bg-gray-100 p-2 rounded-lg">
                                                  <Package size={20} className="text-gray-500" />
                                              </div>
                                              <div>
                                                  <p className="text-sm font-bold text-gray-900">অর্ডার #{order.id}</p>
                                                  <p className="text-xs text-gray-500">{order.date}</p>
                                              </div>
                                          </div>
                                          <div className="text-right">
                                              <p className="text-sm font-bold text-gray-900">{CURRENCY}{order.total}</p>
                                              <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${getOrderStatusColor(order.status)}`}>
                                                  {order.status}
                                              </span>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          ) : (
                              <div className="p-8 text-center text-gray-500">
                                  <Package size={32} className="mx-auto text-gray-300 mb-2" />
                                  <p>কোনো অর্ডার পাওয়া যায়নি।</p>
                              </div>
                          )}
                      </div>
                  </div>
               )}

               {activeTab === 'orders' && (
                  <div className="animate-fade-in bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                          <h3 className="font-bold text-gray-900">অর্ডার ইতিহাস</h3>
                          <button onClick={refreshData} className="flex items-center text-xs text-gray-500 hover:text-green-600">
                             <RefreshCw size={14} className="mr-1" /> রিফ্রেশ
                          </button>
                      </div>
                      <div className="divide-y divide-gray-100">
                          {userOrders.length > 0 ? (
                              userOrders.map(order => (
                                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                                      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                                          <div>
                                              <div className="flex items-center space-x-3">
                                                  <h4 className="text-lg font-bold text-gray-900">#{order.id}</h4>
                                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getOrderStatusColor(order.status)}`}>
                                                      {getOrderStatusIcon(order.status)}
                                                      <span className="ml-1.5 capitalize">{order.status}</span>
                                                  </span>
                                              </div>
                                              <p className="text-sm text-gray-500 mt-1 flex items-center">
                                                  <Calendar size={14} className="mr-1"/> {order.date}
                                              </p>
                                          </div>
                                          <div className="mt-4 sm:mt-0 text-right">
                                              <p className="text-xl font-bold text-green-600">{CURRENCY}{order.total}</p>
                                              <p className="text-xs text-gray-500 capitalize">{order.paymentMethod}</p>
                                          </div>
                                      </div>
                                      
                                      {/* Order Timeline Visual (Mock) */}
                                      <div className="mt-6 relative">
                                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10"></div>
                                          <div className="flex justify-between">
                                              {['pending', 'processing', 'shipped', 'delivered'].map((step, idx) => {
                                                  const isCompleted = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= idx;
                                                  return (
                                                      <div key={step} className="flex flex-col items-center bg-white px-2">
                                                          <div className={`w-3 h-3 rounded-full border-2 ${isCompleted ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'}`}></div>
                                                          <span className={`text-[10px] mt-1 font-medium capitalize ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>{step}</span>
                                                      </div>
                                                  )
                                              })}
                                          </div>
                                      </div>
                                  </div>
                              ))
                          ) : (
                              <div className="p-12 text-center">
                                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                  <h3 className="text-lg font-medium text-gray-900">কোনো অর্ডার নেই</h3>
                                  <p className="text-gray-500 mb-6">আপনি এখনও আমাদের শপ থেকে কিছু কেনেননি।</p>
                                  <button onClick={() => window.location.href='/categories'} className="text-green-600 font-bold hover:underline">কেনাকাটা শুরু করুন</button>
                              </div>
                          )}
                      </div>
                  </div>
               )}

               {activeTab === 'settings' && (
                  <div className="animate-fade-in bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">প্রোফাইল সেটিংস</h3>
                        {!isEditing ? (
                           <button onClick={() => setIsEditing(true)} className="flex items-center text-sm text-green-600 hover:text-green-700 font-medium">
                              <Edit2 size={16} className="mr-1" /> এডিট
                           </button>
                        ) : (
                           <div className="flex space-x-2">
                              <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">বাতিল</button>
                              <button onClick={handleSave} disabled={status === 'saving'} className="px-3 py-1 text-xs font-medium bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                                 {status === 'saving' ? 'সেভ হচ্ছে...' : <><Save size={14} className="mr-1"/> সেভ</>}
                              </button>
                           </div>
                        )}
                     </div>

                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">পুরো নাম</label>
                              <div className="relative">
                                 <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className={`w-full pl-10 p-2.5 rounded-lg border ${isEditing ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' : 'border-gray-200 bg-gray-50'}`}
                                 />
                                 <User size={18} className="absolute left-3 top-3 text-gray-400" />
                              </div>
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">ফোন নাম্বার</label>
                              <div className="relative">
                                 <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    placeholder="01XXXXXXXXX"
                                    className={`w-full pl-10 p-2.5 rounded-lg border ${isEditing ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' : 'border-gray-200 bg-gray-50'}`}
                                 />
                                 <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                              </div>
                           </div>
                           <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল (পরিবর্তনযোগ্য নয়)</label>
                              <div className="relative">
                                 <input type="email" value={user.email} disabled className="w-full pl-10 p-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed" />
                                 <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                              </div>
                           </div>
                           <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">শিপিং অ্যাড্রেস</label>
                              <div className="relative">
                                 <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    placeholder="বাসা নং, রোড নং, এলাকা"
                                    className={`w-full pl-10 p-2.5 rounded-lg border ${isEditing ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' : 'border-gray-200 bg-gray-50'}`}
                                 />
                                 <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                              </div>
                           </div>
                           {isEditing && (
                              <div className="md:col-span-2 border-t border-gray-100 pt-6">
                                 <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড পরিবর্তন (অপশনাল)</label>
                                 <input 
                                    type="password" 
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder="নতুন পাসওয়ার্ড দিন"
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
                                 />
                              </div>
                           )}
                        </div>
                        {status === 'success' && <div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-center text-sm font-medium"><CheckCircle size={16} className="mr-2"/> সফলভাবে আপডেট হয়েছে!</div>}
                        {status === 'error' && <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center text-sm font-medium"><XCircle size={16} className="mr-2"/> আপডেট ব্যর্থ হয়েছে।</div>}
                     </div>
                  </div>
               )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">অ্যাকাউন্ট সারাংশ</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">জয়েন করেছেন</span>
                        <span className="font-medium text-gray-900">{new Date(user.joinedAt || Date.now()).toLocaleDateString()}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">স্ট্যাটাস</span>
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">সক্রিয়</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">ভাষা</span>
                        <span className="font-medium text-gray-900">বাংলা</span>
                     </div>
                  </div>
               </div>

               <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-2">সাহায্য প্রয়োজন?</h3>
                  <p className="text-sm text-blue-700 mb-4">আপনার অর্ডার বা অ্যাকাউন্ট নিয়ে কোনো সমস্যা হলে আমাদের জানান।</p>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                     সাপোর্ট টিমের সাথে কথা বলুন
                  </button>
               </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
