import React from 'react';
import { Users, Target, Globe, Award, CheckCircle } from 'lucide-react';
import { APP_NAME } from '../constants';

const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-green-900 text-white py-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80" 
            alt="Team" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">আমাদের সম্পর্কে</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            {APP_NAME} - বাংলাদেশের অন্যতম বিশ্বস্ত ই-কমার্স এবং এফিলিয়েট প্ল্যাটফর্ম।
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-green-600 font-bold tracking-wider uppercase text-sm">আমাদের লক্ষ্য</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">গুণগত মান এবং গ্রাহক সন্তুষ্টি আমাদের প্রধান অগ্রাধিকার</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              আমরা বিশ্বাস করি প্রযুক্তির সঠিক ব্যবহারের মাধ্যমে কেনাকাটাকে আরও সহজ ও সাশ্রয়ী করা সম্ভব। আমাদের লক্ষ্য হলো দেশের প্রতিটি প্রান্তে দ্রুততম সময়ে সঠিক পণ্য পৌঁছে দেওয়া।
            </p>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-700">
                <CheckCircle className="text-green-500 mr-3" size={20} /> ১০০% অরিজিনাল পণ্য
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="text-green-500 mr-3" size={20} /> দ্রুত ডেলিভারি নেটওয়ার্ক
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="text-green-500 mr-3" size={20} /> ২৪/৭ কাস্টমার সাপোর্ট
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-6 rounded-2xl text-center">
              <Users className="mx-auto text-green-600 mb-3" size={32} />
              <h3 className="text-2xl font-bold text-gray-900">৫০k+</h3>
              <p className="text-sm text-gray-600">হ্যাপি কাস্টমার</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl text-center">
              <Globe className="mx-auto text-blue-600 mb-3" size={32} />
              <h3 className="text-2xl font-bold text-gray-900">৬৪</h3>
              <p className="text-sm text-gray-600">জেলায় ডেলিভারি</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl text-center">
              <Target className="mx-auto text-purple-600 mb-3" size={32} />
              <h3 className="text-2xl font-bold text-gray-900">৫০০০+</h3>
              <p className="text-sm text-gray-600">পণ্য</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-2xl text-center">
              <Award className="mx-auto text-orange-600 mb-3" size={32} />
              <h3 className="text-2xl font-bold text-gray-900">৫+</h3>
              <p className="text-sm text-gray-600">বছর সেবা</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team/Info Strip */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">কেন আমাদের বেছে নেবেন?</h2>
          <p className="text-gray-600">
            আমরা শুধুমাত্র পণ্য বিক্রি করি না, আমরা একটি সম্পর্ক তৈরি করি। আমাদের এফিলিয়েট প্রোগ্রামের মাধ্যমে আপনিও হতে পারেন আমাদের সাফল্যের অংশীদার।
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;