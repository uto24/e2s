import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    // Simulate API call
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', message: '' });
      alert('আপনার বার্তা পাঠানো হয়েছে!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">যোগাযোগ করুন</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            আপনার যেকোনো প্রশ্ন বা মতামতের জন্য আমাদের সাথে যোগাযোগ করুন। আমরা শীঘ্রই আপনার উত্তর দেব।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-sm p-8 h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">আমাদের ঠিকানা</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full text-green-600 mr-4">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">অফিস</h3>
                  <p className="text-gray-600">লেভেল ৪, যমুনা ফিউচার পার্ক, ঢাকা-১২২৯</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">ফোন</h3>
                  <p className="text-gray-600">+৮৮০ ১৭১০-০০০০০০</p>
                  <p className="text-gray-600 text-sm">সকাল ১০টা - রাত ৮টা</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600 mr-4">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">ইমেইল</h3>
                  <p className="text-gray-600">support@e2s-shop.com</p>
                  <p className="text-gray-600">info@e2s-shop.com</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="font-bold text-gray-900 mb-4">সোশ্যাল মিডিয়া</h3>
              <div className="flex space-x-4">
                <a href="#" className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"><Facebook size={20} /></a>
                <a href="#" className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-sky-500 hover:text-white transition-colors"><Twitter size={20} /></a>
                <a href="#" className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-pink-600 hover:text-white transition-colors"><Instagram size={20} /></a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">বার্তা পাঠান</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="সম্পূর্ণ নাম"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="example@mail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">বার্তা</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="কিভাবে আপনাকে সাহায্য করতে পারি?"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={sent}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                {sent ? 'পাঠানো হচ্ছে...' : <><Send size={18} className="mr-2" /> বার্তা পাঠান</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;