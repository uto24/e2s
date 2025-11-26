
import React, { useState } from 'react';
import { MessageCircle, X, Phone, MessageSquare, Facebook, Headset } from 'lucide-react';

export const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Replace these with actual support numbers/links
  const whatsappNumber = "8801700000000"; 
  const phoneNumber = "+8801700000000";
  const messengerLink = "https://m.me/yourpage"; 

  const handleLinkClick = (url: string) => {
      window.open(url, '_blank');
      setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Support Menu */}
      {isOpen && (
        <div className="mb-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up origin-bottom-right">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-5 flex justify-between items-center text-white">
            <div>
              <h3 className="font-bold text-lg flex items-center"><Headset size={20} className="mr-2"/> সাপোর্ট সেন্টার</h3>
              <p className="text-xs text-green-100 opacity-90">কিভাবে আপনাকে সাহায্য করতে পারি?</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="p-4 space-y-3">
             <button 
                onClick={() => handleLinkClick(`https://wa.me/${whatsappNumber}`)}
                className="w-full flex items-center p-3 rounded-xl hover:bg-green-50 transition-colors border border-gray-100 hover:border-green-200 group"
             >
                <div className="bg-green-100 p-2 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <MessageCircle size={20} />
                </div>
                <div className="ml-3 text-left">
                    <p className="text-sm font-bold text-gray-800">হোয়াটসঅ্যাপ (WhatsApp)</p>
                    <p className="text-xs text-gray-500">চ্যাট করতে ক্লিক করুন</p>
                </div>
             </button>

             <button 
                onClick={() => handleLinkClick(messengerLink)}
                className="w-full flex items-center p-3 rounded-xl hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-200 group"
             >
                <div className="bg-blue-100 p-2 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Facebook size={20} />
                </div>
                <div className="ml-3 text-left">
                    <p className="text-sm font-bold text-gray-800">মেসেঞ্জার (Messenger)</p>
                    <p className="text-xs text-gray-500">ফেসবুকে মেসেজ দিন</p>
                </div>
             </button>

             <a 
                href={`tel:${phoneNumber}`}
                className="w-full flex items-center p-3 rounded-xl hover:bg-purple-50 transition-colors border border-gray-100 hover:border-purple-200 group"
             >
                <div className="bg-purple-100 p-2 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Phone size={20} />
                </div>
                <div className="ml-3 text-left">
                    <p className="text-sm font-bold text-gray-800">ফোন কল</p>
                    <p className="text-xs text-gray-500">{phoneNumber}</p>
                </div>
             </a>
          </div>
          <div className="bg-gray-50 p-3 text-center text-xs text-gray-400 border-t border-gray-100">
             সকাল ১০টা থেকে রাত ৮টা পর্যন্ত খোলা
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-gray-800 rotate-90' : 'bg-green-600 hover:bg-green-700'
        } text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center ring-4 ring-white/30`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} fill="currentColor" />}
      </button>
    </div>
  );
};
