import React from 'react';
import { Phone, Mail, MessageCircle, Facebook, HelpCircle, ChevronDown, ExternalLink } from 'lucide-react';

const Support: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">সাপোর্ট সেন্টার</h1>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <a href="tel:+8801700000000" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center group">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 group-hover:scale-110 transition-transform">
              <Phone size={28} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">হটলাইন</h3>
            <p className="text-gray-500 text-sm">+৮৮০ ১৭১০-০০০০০০</p>
          </a>

          <a href="mailto:support@e2s-shop.com" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center group">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 group-hover:scale-110 transition-transform">
              <Mail size={28} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">ইমেইল</h3>
            <p className="text-gray-500 text-sm">support@e2s-shop.com</p>
          </a>

          <a href="https://www.facebook.com/your-page-link" target="_blank" rel="noreferrer" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center group">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform">
              <Facebook size={28} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">ফেসবুক পেজ</h3>
            <p className="text-gray-500 text-sm flex items-center justify-center">মেসেজ দিন <ExternalLink size={12} className="ml-1"/></p>
          </a>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <HelpCircle size={24} className="mr-2 text-green-600" /> সচরাচর জিজ্ঞাসা (FAQ)
          </h2>
          <div className="space-y-4">
            <details className="group bg-gray-50 rounded-xl p-4 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                ডেলিভারি চার্জ কত?
                <ChevronDown className="transition duration-300 group-open:-rotate-180" />
              </summary>
              <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                ঢাকার ভিতরে ৬০ টাকা এবং ঢাকার বাইরে ১২০ টাকা। তবে অর্ডারের ওজন বা সাইজ অনুযায়ী এটি পরিবর্তন হতে পারে।
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-4 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                কত দিনের মধ্যে ডেলিভারি পাবো?
                <ChevronDown className="transition duration-300 group-open:-rotate-180" />
              </summary>
              <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                সাধারণত ঢাকার ভিতরে ২৪-৪৮ ঘন্টা এবং ঢাকার বাইরে ২-৫ কর্মদিবসের মধ্যে ডেলিভারি করা হয়।
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-4 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                পণ্য রিটার্ন করা যাবে কি?
                <ChevronDown className="transition duration-300 group-open:-rotate-180" />
              </summary>
              <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                হ্যাঁ, পণ্য হাতে পাওয়ার ৩ দিনের মধ্যে কোনো ত্রুটি থাকলে রিটার্ন বা রিপ্লেসমেন্ট করা যাবে। সেক্ষেত্রে অবশ্যই আনবক্সিং ভিডিও থাকতে হবে।
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-4 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                এফিলিয়েট কমিশন কিভাবে পাবো?
                <ChevronDown className="transition duration-300 group-open:-rotate-180" />
              </summary>
              <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                আপনার রেফারেল লিংকের মাধ্যমে অর্ডার ডেলিভারি হওয়ার পর কমিশন আপনার ড্যাশবোর্ডে জমা হবে। ৫০০ টাকা হলেই বিকাশ বা নগদে উইথড্র করতে পারবেন।
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;