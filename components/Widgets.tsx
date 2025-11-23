import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up origin-bottom-right">
          <div className="bg-green-600 p-4 flex justify-between items-center text-white">
            <div>
              <h3 className="font-bold">সাপোর্ট সেন্টার</h3>
              <p className="text-xs text-green-100">আমরা অনলাইনে আছি!</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-green-700 p-1 rounded">
              <X size={18} />
            </button>
          </div>
          <div className="h-64 bg-gray-50 p-4 overflow-y-auto">
            <div className="flex flex-col space-y-3">
              <div className="self-start bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm text-sm text-gray-700 max-w-[85%] border border-gray-100">
                হ্যালো! কিভাবে আপনাকে সাহায্য করতে পারি?
              </div>
            </div>
          </div>
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input 
                type="text" 
                placeholder="মেসেজ লিখুন..." 
                className="bg-transparent flex-1 focus:outline-none text-sm"
              />
              <button className="text-green-600 hover:text-green-700">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-gray-800' : 'bg-green-600 hover:bg-green-700'
        } text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};
