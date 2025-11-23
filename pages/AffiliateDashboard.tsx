import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Copy, DollarSign, MousePointer, TrendingUp, Wallet, ArrowRight, CheckCircle, Clock, AlertTriangle, Send } from 'lucide-react';
import { AFFILIATE_STATS, CURRENCY } from '../constants';
import { useAuth, useShop } from '../services/store';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../types';

const AffiliateDashboard: React.FC = () => {
  const { user } = useAuth();
  const { submitAffiliateApplication } = useShop();
  const [formData, setFormData] = useState({
      paymentMethod: 'bkash',
      accountNumber: '',
      promotionMethod: '',
      socialLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // --- Logic for Approved Affiliates (The Dashboard) ---
  if (user.role === UserRole.AFFILIATE) {
    const totalEarnings = AFFILIATE_STATS.reduce((acc, cur) => acc + cur.earnings, 0);
    const totalClicks = AFFILIATE_STATS.reduce((acc, cur) => acc + cur.clicks, 0);
    const referralLink = `${window.location.origin}/?ref=${user.affiliate_id}`;

    const copyToClipboard = () => {
      navigator.clipboard.writeText(referralLink);
      alert('রেফারেল লিংক কপি হয়েছে!');
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              এফিলিয়েট ড্যাশবোর্ড
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              স্বাগতম, {user.name}। আপনার পারফরম্যান্স এবং আয় ট্র্যাক করুন।
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none">
              <DollarSign size={16} className="mr-2"/> উইথড্র করুন
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">মোট আয়</dt>
                    <dd className="text-lg font-medium text-gray-900">{CURRENCY}{totalEarnings.toFixed(2)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">বর্তমান ব্যালেন্স</dt>
                    <dd className="text-lg font-medium text-gray-900">{CURRENCY}{user.balance.toFixed(2)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <MousePointer className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">মোট ক্লিক</dt>
                    <dd className="text-lg font-medium text-gray-900">{totalClicks}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">কনভার্সন রেট</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalClicks > 0 
                        ? ((AFFILIATE_STATS.reduce((a, b) => a + b.conversions, 0) / totalClicks) * 100).toFixed(1) 
                        : 0}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-white shadow sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">আপনার রেফারেল লিংক</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>এই লিংকটি শেয়ার করুন এবং প্রতিটি সেলে কমিশন জিতে নিন।</p>
            </div>
            <div className="mt-5 sm:flex sm:items-center">
              <div className="w-full sm:max-w-lg">
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="focus:ring-green-500 focus:border-green-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 p-3 bg-gray-50"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100 rounded-r-md transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">আয় বিবরণী (শেষ ৭ দিন)</h3>
            <div className="h-72 w-full flex items-center justify-center bg-gray-50 rounded-lg text-gray-400">
               {AFFILIATE_STATS.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={AFFILIATE_STATS}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${CURRENCY}${value}`, 'আয়']} />
                      <Bar dataKey="earnings" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               ) : <p>কোনো তথ্য নেই</p>}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">ট্রাফিক রিপোর্ট</h3>
            <div className="h-72 w-full flex items-center justify-center bg-gray-50 rounded-lg text-gray-400">
               {AFFILIATE_STATS.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={AFFILIATE_STATS}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
               ) : <p>কোনো তথ্য নেই</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Logic for Pending Applicants ---
  if (user.affiliateStatus === 'pending') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 animate-fade-in">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-yellow-500">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Clock size={40} className="text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">আবেদন জমা হয়েছে</h2>
                  <p className="text-gray-500 mb-6">
                      আপনার এফিলিয়েট আবেদনটি বর্তমানে রিভিউতে আছে। অ্যাডমিন অ্যাপ্রুভ করলে আপনি ড্যাশবোর্ড অ্যাক্সেস করতে পারবেন।
                  </p>
                  <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
                      সাধারণত ২৪-৪৮ ঘন্টার মধ্যে ফলাফল জানানো হয়।
                  </div>
              </div>
          </div>
      );
  }

  // --- Logic for Rejected Applicants ---
  if (user.affiliateStatus === 'rejected') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 animate-fade-in">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-red-500">
                   <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle size={40} className="text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">আবেদন বাতিল করা হয়েছে</h2>
                  <p className="text-gray-500 mb-6">
                      দুঃখিত, আপনার এফিলিয়েট আবেদনটি গ্রহণ করা সম্ভব হয়নি। বিস্তারিত জানতে সাপোর্টে যোগাযোগ করুন।
                  </p>
                   <button 
                    onClick={() => window.location.href = '/contact'}
                    className="text-green-600 font-bold hover:underline"
                   >
                       সাপোর্টে কথা বলুন
                   </button>
              </div>
          </div>
      );
  }

  // --- Logic for New Application (Form) ---
  const handleApply = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          await submitAffiliateApplication(formData);
          // UI will auto-update due to auth listener
      } catch (error) {
          console.error(error);
          alert("আবেদন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
          setIsSubmitting(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-green-600 px-8 py-12 text-center text-white">
                <h1 className="text-3xl font-bold mb-4">আমাদের এফিলিয়েট প্রোগ্রামে জয়েন করুন</h1>
                <p className="text-green-100 max-w-2xl mx-auto">
                    কোনো বিনিয়োগ ছাড়াই আয় শুরু করুন। আপনার নেটওয়ার্ক ব্যবহার করে পণ্য বিক্রি করুন এবং আকর্ষণীয় কমিশন জিতে নিন।
                </p>
            </div>
            
            <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                     <div className="text-center">
                         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                             <CheckCircle />
                         </div>
                         <h3 className="font-bold text-gray-900">রেজিস্ট্রেশন করুন</h3>
                         <p className="text-sm text-gray-500 mt-2">নিচের ফর্মটি পূরণ করে আবেদন জমা দিন।</p>
                     </div>
                     <div className="text-center">
                         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                             <Clock />
                         </div>
                         <h3 className="font-bold text-gray-900">অ্যাপ্রুভাল নিন</h3>
                         <p className="text-sm text-gray-500 mt-2">আমাদের টিম আপনার তথ্য যাচাই করবে।</p>
                     </div>
                     <div className="text-center">
                         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                             <TrendingUp />
                         </div>
                         <h3 className="font-bold text-gray-900">আয় শুরু করুন</h3>
                         <p className="text-sm text-gray-500 mt-2">পণ্য শেয়ার করুন এবং কমিশন পান।</p>
                     </div>
                </div>

                <form onSubmit={handleApply} className="max-w-lg mx-auto space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">পেমেন্ট মেথড (যেখানে টাকা নিবেন)</label>
                        <select 
                            value={formData.paymentMethod}
                            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="bkash">বিকাশ</option>
                            <option value="nagad">নগদ</option>
                            <option value="rocket">রকেট</option>
                            <option value="bank">ব্যাংক ট্রান্সফার</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">অ্যাকাউন্ট নম্বর</label>
                        <input 
                            type="text" 
                            required
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                            placeholder="01XXXXXXXXX"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">প্রমোশন মেথড (কিভাবে প্রমোট করবেন?)</label>
                        <textarea 
                            required
                            rows={3}
                            value={formData.promotionMethod}
                            onChange={(e) => setFormData({...formData, promotionMethod: e.target.value})}
                            placeholder="যেমন: ফেসবুক গ্রুপ, ইউটিউব চ্যানেল, ওয়েবসাইট..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">সোশ্যাল প্রোফাইল লিংক (অপশনাল)</label>
                        <input 
                            type="url" 
                            value={formData.socialLink}
                            onChange={(e) => setFormData({...formData, socialLink: e.target.value})}
                            placeholder="https://facebook.com/username"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex justify-center items-center shadow-lg shadow-green-200"
                    >
                        {isSubmitting ? 'জমা দেওয়া হচ্ছে...' : <><Send size={18} className="mr-2"/> আবেদন জমা দিন</>}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;