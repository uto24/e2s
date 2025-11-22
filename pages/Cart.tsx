import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, MapPin, CreditCard, AlertTriangle, ShoppingBag } from 'lucide-react';
import { useCart, useShop } from '../services/store';
import { CURRENCY } from '../constants';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { settings } = useShop();
  
  // Shipping State (Default to inside city)
  const [shippingLocation, setShippingLocation] = useState<'inside' | 'outside'>('inside');
  
  const shippingCost = items.reduce((sum, item) => {
    const fee = shippingLocation === 'inside' 
      ? (item.shippingFees?.inside || 0) 
      : (item.shippingFees?.outside || 0);
    return sum + (fee * item.quantity);
  }, 0);

  const taxAmount = total * (settings.taxRate / 100);
  const grandTotal = total + shippingCost + taxAmount;

  const isCodAvailable = items.every(item => item.isCodAvailable);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse-soft">
          <ShoppingBag size={64} className="text-red-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">আপনার কার্ট খালি</h2>
        <p className="text-gray-500 mb-8 text-lg">আপনি এখনও কোনো পণ্য কার্টে যোগ করেননি।</p>
        <Link to="/" className="px-10 py-4 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
          কেনাকাটা করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <ShoppingBag className="mr-3 text-red-600" /> শপিং কার্ট
      </h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Cart Items List */}
        <section className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 lg:mb-0">
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li key={item.cartItemId} className="flex p-6 hover:bg-gray-50 transition-colors">
                <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-6 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-bold text-gray-900">
                      <h3 className="text-lg">
                        <Link to={`/product/${item.id}`} className="hover:text-red-600 transition-colors">{item.title}</Link>
                      </h3>
                      <p className="ml-4 text-red-600">
                        {CURRENCY}{((item.sale_price || item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                    
                    <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-2">
                      {item.selectedSize && <span className="bg-gray-100 px-2 py-1 rounded text-xs">সাইজ: <strong>{item.selectedSize}</strong></span>}
                      {item.selectedColor && <span className="bg-gray-100 px-2 py-1 rounded text-xs">কালার: <strong>{item.selectedColor}</strong></span>}
                    </div>
                    
                    <div className="mt-1 text-xs text-gray-400">
                      ডেলিভারি চার্জ: {CURRENCY}{item.shippingFees?.[shippingLocation]} / প্রতি পিস
                    </div>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                       <button 
                         onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                         className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                       >
                         <Minus size={14} />
                       </button>
                       <span className="px-4 font-medium min-w-[2rem] text-center">{item.quantity}</span>
                       <button 
                         onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                         className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                       >
                         <Plus size={14} />
                       </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="font-medium text-red-500 hover:text-red-700 flex items-center bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="mr-1" /> ডিলিট
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
             <button onClick={clearCart} className="text-sm text-red-600 hover:text-red-800 hover:underline font-medium">সব ডিলিট করুন</button>
          </div>
        </section>

        {/* Order Summary */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Shipping Selector */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MapPin size={20} className="mr-2 text-red-600"/> ডেলিভারি এলাকা
            </h2>
            <div className="space-y-3">
              <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 ${shippingLocation === 'inside' ? 'border-red-500 bg-red-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="shipping" 
                    checked={shippingLocation === 'inside'} 
                    onChange={() => setShippingLocation('inside')}
                    className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="ml-3 font-bold text-gray-900">ঢাকা সিটি</span>
                </div>
                <span className="text-xs font-medium bg-white px-2 py-1 rounded border border-gray-100 text-gray-500">দ্রুত ডেলিভারি</span>
              </label>

              <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 ${shippingLocation === 'outside' ? 'border-red-500 bg-red-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="shipping" 
                    checked={shippingLocation === 'outside'} 
                    onChange={() => setShippingLocation('outside')}
                    className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="ml-3 font-bold text-gray-900">সারা বাংলাদেশ</span>
                </div>
                 <span className="text-xs font-medium bg-white px-2 py-1 rounded border border-gray-100 text-gray-500">কুরিয়ার</span>
              </label>
            </div>
            
            <div className="mt-5 pt-5 border-t border-gray-100">
               <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                 <CreditCard size={18} className="mr-2 text-gray-500" />
                 ক্যাশ অন ডেলিভারি: 
                 <span className={`font-bold ml-auto ${isCodAvailable ? 'text-green-600' : 'text-red-600'}`}>
                   {isCodAvailable ? 'পাবেন' : 'পাবেন না'}
                 </span>
               </div>
               {!isCodAvailable && (
                 <div className="mt-2 flex items-start text-xs text-red-500 font-medium">
                   <AlertTriangle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                   কিছু পণ্যে ক্যাশ অন ডেলিভারি সুবিধা নেই।
                 </div>
               )}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">অর্ডার সারাংশ</h2>

            <div className="flow-root">
              <dl className="-my-2 text-sm divide-y divide-gray-100">
                <div className="py-3 flex items-center justify-between">
                  <dt className="text-gray-600">সাবটোটাল</dt>
                  <dd className="font-bold text-gray-900">{CURRENCY}{total.toLocaleString()}</dd>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <dt className="text-gray-600">ডেলিভারি চার্জ</dt>
                  <dd className="font-bold text-gray-900">{CURRENCY}{shippingCost.toLocaleString()}</dd>
                </div>
                {settings.taxRate > 0 && (
                  <div className="py-3 flex items-center justify-between">
                    <dt className="text-gray-600">ভ্যাট ({settings.taxRate}%)</dt>
                    <dd className="font-bold text-gray-900">{CURRENCY}{taxAmount.toLocaleString()}</dd>
                  </div>
                )}
                <div className="py-4 flex items-center justify-between border-t border-gray-200 mt-4">
                  <dt className="text-lg font-bold text-gray-900">সর্বমোট</dt>
                  <dd className="text-xl font-bold text-red-600">{CURRENCY}{grandTotal.toLocaleString()}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-8">
              <button
                className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-full shadow-lg shadow-red-200 text-base font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:-translate-y-1"
              >
                অর্ডার কনফার্ম করুন <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                অথবা <Link to="/" className="text-red-600 font-medium hover:text-red-500 hover:underline">কেনাকাটা চালিয়ে যান</Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cart;