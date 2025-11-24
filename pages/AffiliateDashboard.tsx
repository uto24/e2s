
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Copy, DollarSign, MousePointer, TrendingUp, Wallet, CheckCircle, Clock, AlertTriangle, Send, CreditCard, Link as LinkIcon, BarChart2, ShoppingBag, Search, ExternalLink, X } from 'lucide-react';
import { AFFILIATE_STATS, CURRENCY } from '../constants';
import { useAuth, useShop } from '../services/store';
import { Navigate } from 'react-router-dom';
import { UserRole, Product } from '../types';
import { encryptResellerData } from '../utils/secureLink';

const AffiliateDashboard: React.FC = () => {
  const { user } = useAuth();
  const { submitAffiliateApplication, products } = useShop();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tools' | 'products'>('dashboard');
  
  // Reseller Tools State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
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

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      alert('লিংক কপি হয়েছে!');
    };

    const handleGenerateLink = () => {
        if(!selectedProduct || !customPrice) return;
        
        const price = parseFloat(customPrice);
        if(isNaN(price) || price < selectedProduct.wholesalePrice) {
            alert(`দয়া করে সঠিক মূল্য দিন। সর্বনিম্ন মূল্য: ${selectedProduct.wholesalePrice}`);
            return;
        }

        // Use the encryption utility
        const encryptedRef = encryptResellerData(user.affiliate_id || user.uid, price);
        const link = `${window.location.origin}/#/product/${selectedProduct.id}?r=${encryptedRef}`;
        setGeneratedLink(link);
    };

    const filteredProducts = products.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              রিসেলার ড্যাশবোর্ড
            </h2>
            <p className="mt-2 text-gray-500">
              স্বাগতম, <span className="font-semibold text-gray-800">{user.name}</span>! আয় বাড়াতে প্রমোট করুন।
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-3">
             <button 
                onClick={() => setActiveTab('products')}
                className={`inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm ${activeTab === 'products' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
             >
               <ShoppingBag size={18} className="mr-2"/> প্রডাক্ট জোন
            </button>
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm ${activeTab === 'dashboard' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
             >
               <BarChart2 size={18} className="mr-2"/> ওভারভিউ
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
            <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { title: "মোট আয়", value: totalEarnings.toFixed(2), icon: DollarSign, bg: "bg-gradient-to-br from-green-500 to-emerald-600", prefix: CURRENCY },
                    { title: "বর্তমান ব্যালেন্স", value: user.balance.toFixed(2), icon: Wallet, bg: "bg-gradient-to-br from-blue-500 to-indigo-600", prefix: CURRENCY },
                    { title: "মোট ক্লিক", value: totalClicks, icon: MousePointer, bg: "bg-gradient-to-br from-purple-500 to-violet-600", prefix: "" },
                    { title: "কনভার্সন", value: totalClicks > 0 ? ((AFFILIATE_STATS.reduce((a, b) => a + b.conversions, 0) / totalClicks) * 100).toFixed(1) : "0", icon: TrendingUp, bg: "bg-gradient-to-br from-orange-400 to-pink-500", suffix: "%", prefix: "" },
                ].map((stat, i) => (
                    <div key={i} className="relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-white p-6 group hover:shadow-lg transition-all duration-300">
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.prefix}{stat.value}{stat.suffix}</h3>
                            </div>
                            <div className={`p-3 rounded-xl text-white shadow-lg ${stat.bg} transform group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        {/* Decoration */}
                        <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 ${stat.bg}`}></div>
                    </div>
                ))}
                </div>

                {/* Default Link Generator */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="relative z-10 max-w-3xl">
                        <div className="flex items-center mb-4">
                            <div className="bg-green-100 p-2 rounded-lg text-green-600 mr-3">
                                <LinkIcon size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">আপনার সাধারণ রেফারেল লিংক</h3>
                        </div>
                        <p className="text-gray-500 mb-6 text-sm">
                        এই লিংকটি শেয়ার করুন। লিংকে ক্লিক করে কেউ কিছু কিনলে আপনি কমিশন পাবেন। নির্দিষ্ট পণ্যের জন্য "প্রডাক্ট জোন" ব্যবহার করুন।
                        </p>
                        <div className="flex rounded-xl shadow-sm border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-green-500 transition-shadow">
                        <div className="bg-gray-50 px-4 py-3 border-r border-gray-200 text-gray-500 select-none hidden sm:block">
                            .../
                        </div>
                        <input
                            type="text"
                            readOnly
                            value={referralLink.split('//')[1]}
                            className="flex-1 block w-full border-0 py-3 pl-4 focus:ring-0 text-gray-900 font-medium"
                        />
                        <button
                            onClick={() => copyToClipboard(referralLink)}
                            className="bg-gray-900 text-white px-6 py-3 font-bold text-sm hover:bg-gray-800 transition-colors flex items-center"
                        >
                            <Copy size={16} className="mr-2" /> কপি
                        </button>
                        </div>
                    </div>
                </div>

                 {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">আয় বিবরণী (শেষ ৭ দিন)</h3>
                        <div className="h-72 w-full">
                        {AFFILIATE_STATS.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={AFFILIATE_STATS}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                                    formatter={(value) => [`${CURRENCY}${value}`, 'আয়']} 
                                />
                                <Bar dataKey="earnings" fill="#16a34a" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <BarChart2 size={40} className="mb-2 opacity-20" />
                                <p>কোনো তথ্য নেই</p>
                            </div>
                        )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">ট্রাফিক এনালিটিক্স</h3>
                        <div className="h-72 w-full">
                        {AFFILIATE_STATS.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={AFFILIATE_STATS}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <TrendingUp size={40} className="mb-2 opacity-20" />
                                <p>কোনো তথ্য নেই</p>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </>
        )}

        {activeTab === 'products' && (
            <div className="space-y-8">
                 {/* Product Selection & Link Generation */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <input 
                                type="text" 
                                placeholder="পণ্য খুঁজুন..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                        <p className="text-sm text-gray-500">
                            পণ্য নির্বাচন করে "Create Link" এ ক্লিক করুন।
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">পণ্য</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">হোলসেল প্রাইস</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">খুচরা মূল্য</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt="" />
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{product.title}</div>
                                                    <div className="text-xs text-gray-500">{product.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800">
                                                {CURRENCY}{product.wholesalePrice}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {CURRENCY}{product.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setCustomPrice(product.price.toString());
                                                    setGeneratedLink('');
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm shadow-green-200"
                                            >
                                                Create Link
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>

                 {/* Link Creator Panel */}
                 {selectedProduct && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
                         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
                             <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                 <h3 className="text-lg font-bold text-gray-900">লিংক জেনারেটর</h3>
                                 <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-red-500 bg-white rounded-full p-1"><X size={20} /></button>
                             </div>
                             
                             <div className="p-6 space-y-6">
                                 <div className="flex items-center space-x-4">
                                     <img src={selectedProduct.image} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                                     <div>
                                         <h4 className="font-bold text-gray-900">{selectedProduct.title}</h4>
                                         <p className="text-sm text-gray-500">হোলসেল প্রাইস: <span className="font-bold text-blue-600">{CURRENCY}{selectedProduct.wholesalePrice}</span></p>
                                     </div>
                                 </div>

                                 <div>
                                     <label className="block text-sm font-bold text-gray-700 mb-2">আপনার বিক্রয় মূল্য (Selling Price)</label>
                                     <div className="relative">
                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 font-bold">{CURRENCY}</span>
                                         </div>
                                         <input 
                                            type="number" 
                                            value={customPrice}
                                            onChange={(e) => {
                                                setCustomPrice(e.target.value);
                                                setGeneratedLink('');
                                            }}
                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 font-bold text-lg"
                                         />
                                     </div>
                                     
                                     {parseFloat(customPrice) >= selectedProduct.wholesalePrice ? (
                                        <div className="mt-2 text-sm text-green-600 font-bold flex items-center bg-green-50 p-2 rounded-lg">
                                            <CheckCircle size={14} className="mr-2" />
                                            আপনার লাভ: {CURRENCY}{(parseFloat(customPrice) - selectedProduct.wholesalePrice).toFixed(2)}
                                        </div>
                                     ) : (
                                        <div className="mt-2 text-sm text-red-500 font-bold flex items-center">
                                            <AlertTriangle size={14} className="mr-2" />
                                            মূল্য হোলসেল প্রাইসের চেয়ে কম হতে পারবে না।
                                        </div>
                                     )}
                                 </div>

                                 {generatedLink ? (
                                     <div className="animate-fade-in">
                                         <label className="block text-sm font-bold text-gray-700 mb-2">আপনার সিকিউর লিংক</label>
                                         <div className="flex rounded-xl border border-green-200 bg-green-50 overflow-hidden">
                                             <input 
                                                type="text" 
                                                readOnly 
                                                value={generatedLink} 
                                                className="flex-1 p-3 bg-transparent text-sm text-green-800 font-medium focus:outline-none"
                                             />
                                             <button 
                                                onClick={() => copyToClipboard(generatedLink)}
                                                className="bg-green-600 text-white px-4 hover:bg-green-700 transition-colors"
                                             >
                                                 <Copy size={18} />
                                             </button>
                                         </div>
                                         <p className="text-xs text-gray-500 mt-2 text-center">এই লিংকটি কাস্টমারকে দিন। তারা এই লিংকে ঢুকলে আপনার সেট করা প্রাইস দেখবে।</p>
                                     </div>
                                 ) : (
                                     <button 
                                        onClick={handleGenerateLink}
                                        disabled={!customPrice || parseFloat(customPrice) < selectedProduct.wholesalePrice}
                                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                     >
                                         লিংক তৈরি করুন
                                     </button>
                                 )}
                             </div>
                         </div>
                     </div>
                 )}
            </div>
        )}
      </div>
    );
  }

  // --- Logic for Pending Applicants ---
  if (user.affiliateStatus === 'pending') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 animate-fade-in">
              <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
                  <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Clock size={36} className="text-yellow-500 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">আবেদন জমা হয়েছে</h2>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                      আপনার এফিলিয়েট আবেদনটি বর্তমানে রিভিউতে আছে। আমাদের টিম যাচাই করার পর আপনাকে নোটিফিকেশন পাঠাবে।
                  </p>
                  <div className="bg-slate-50 rounded-xl p-4 text-sm font-medium text-slate-600 border border-slate-100">
                      গড় সময়: ২৪-৪৮ ঘন্টা
                  </div>
              </div>
          </div>
      );
  }

  // --- Logic for Rejected Applicants ---
  if (user.affiliateStatus === 'rejected') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 animate-fade-in">
              <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle size={36} className="text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">আবেদন বাতিল করা হয়েছে</h2>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                      দুঃখিত, আমাদের পলিসির সাথে সামঞ্জস্য না থাকায় আপনার আবেদনটি গ্রহণ করা সম্ভব হয়নি।
                  </p>
                   <button 
                    onClick={() => window.location.href = '/contact'}
                    className="w-full py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                   >
                       সাপোর্টে যোগাযোগ করুন
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
      } catch (error) {
          console.error(error);
          alert("আবেদন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
          setIsSubmitting(false);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="relative bg-slate-900 px-8 py-16 text-center text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
                
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">এফিলিয়েট ও রিসেলার প্রোগ্রাম</h1>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        আপনার সোশ্যাল মিডিয়া বা ওয়েবসাইট ব্যবহার করে আমাদের পণ্যের প্রচার করুন এবং প্রতিটি সফল বিক্রয়ে আকর্ষণীয় কমিশন জিতে নিন। অথবা রিসেলার হিসেবে নিজের দামে পণ্য বিক্রি করুন।
                    </p>
                </div>
            </div>
            
            <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                     {[
                         { icon: CheckCircle, title: "রেজিস্ট্রেশন", desc: "নিচের ফর্মটি সঠিকভাবে পূরণ করুন" },
                         { icon: Clock, title: "রিভিউ", desc: "আমাদের টিম আপনার তথ্য যাচাই করবে" },
                         { icon: TrendingUp, title: "আয় শুরু", desc: "লিংক শেয়ার করুন এবং কমিশন পান" }
                     ].map((step, i) => (
                        <div key={i} className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <step.icon size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500">{step.desc}</p>
                        </div>
                     ))}
                </div>

                <div className="max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">আবেদন ফর্ম</h3>
                    <form onSubmit={handleApply} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">পেমেন্ট মেথড</label>
                                <div className="relative">
                                    <select 
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                                        className="w-full p-4 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none"
                                    >
                                        <option value="bkash">বিকাশ (bKash)</option>
                                        <option value="nagad">নগদ (Nagad)</option>
                                        <option value="rocket">রকেট (Rocket)</option>
                                        <option value="bank">ব্যাংক ট্রান্সফার</option>
                                    </select>
                                    <CreditCard size={18} className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">অ্যাকাউন্ট নম্বর</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                                    placeholder="01XXXXXXXXX"
                                    className="w-full p-4 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">প্রমোশন মেথড</label>
                            <textarea 
                                required
                                rows={3}
                                value={formData.promotionMethod}
                                onChange={(e) => setFormData({...formData, promotionMethod: e.target.value})}
                                placeholder="আপনি কিভাবে আমাদের পণ্য প্রমোট করবেন? (যেমন: ফেসবুক পেজ, ইউটিউব চ্যানেল, ওয়েবসাইট লিংক...)"
                                className="w-full p-4 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">সোশ্যাল প্রোফাইল লিংক <span className="text-gray-400 font-normal">(অপশনাল)</span></label>
                            <input 
                                type="url" 
                                value={formData.socialLink}
                                onChange={(e) => setFormData({...formData, socialLink: e.target.value})}
                                placeholder="https://facebook.com/username"
                                className="w-full p-4 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all transform hover:-translate-y-1 shadow-lg shadow-green-200 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'জমা দেওয়া হচ্ছে...' : <><Send size={20} className="mr-2"/> আবেদন জমা দিন</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
