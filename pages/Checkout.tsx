import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart, useAuth, useShop } from '../services/store';
import { CURRENCY } from '../constants';
import { MapPin, Phone, User, CheckCircle, AlertCircle, ArrowRight, CreditCard, Gift, Loader } from 'lucide-react';

type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket';

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { user, addPoints } = useAuth();
  const { settings, placeOrder } = useShop();
  const location = useLocation();
  const navigate = useNavigate();

  // Passed from Cart page
  const shippingLocation = location.state?.shippingLocation || 'inside';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    note: ''
  });

  // Sync user data if user loads late
  useEffect(() => {
    if (user) {
        setFormData(prev => ({
            ...prev,
            name: user.name || prev.name,
            phone: user.phone || prev.phone,
            address: user.address || prev.address
        }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      navigate('/');
    }
  }, [items, navigate, orderSuccess]);

  const shippingCost = items.reduce((sum, item) => {
    const fee = shippingLocation === 'inside' 
      ? (item.shippingFees?.inside || 0) 
      : (item.shippingFees?.outside || 0);
    return sum + (fee * item.quantity);
  }, 0);

  const taxAmount = total * (settings.taxRate / 100);
  const grandTotal = total + shippingCost + taxAmount;
  
  // Calculate potential points (1 point per 100 currency)
  const potentialPoints = Math.floor(total / 100);

  const isCodAvailable = items.every(item => item.isCodAvailable);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isCodAvailable && paymentMethod === 'cod') {
      alert("এই অর্ডারে ক্যাশ অন ডেলিভারি সম্ভব নয়। দয়া করে মোবাইল পেমেন্ট সিলেক্ট করুন।");
      return;
    }

    if (paymentMethod !== 'cod' && (!transactionId || !senderNumber)) {
      alert("দয়া করে ট্রানজেকশন আইডি এবং সেন্ডার নম্বর দিন।");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const newOrder = {
        id: orderId,
        customer: formData.name,
        // Crucial: Use logged-in email. If not logged in, prompt or use default.
        email: user ? user.email : 'guest@example.com', 
        total: grandTotal,
        status: 'pending' as const,
        date: new Date().toLocaleDateString(),
        items: items.reduce((acc, item) => acc + item.quantity, 0),
        paymentMethod,
        shippingAddress: formData,
        transactionId: paymentMethod !== 'cod' ? transactionId : undefined,
        senderNumber: paymentMethod !== 'cod' ? senderNumber : undefined
      };

      // Ensure this is properly awaited to save to Firebase
      await placeOrder(newOrder);
      
      // Award Points if user is logged in
      if (user && potentialPoints > 0) {
        await addPoints(potentialPoints);
        setEarnedPoints(potentialPoints);
      }

      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      console.error("Order failed", error);
      alert("অর্ডার প্লেস করতে সমস্যা হয়েছে। দয়া করে ইন্টারনেট কানেকশন চেক করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 animate-fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100 relative overflow-hidden">
          {earnedPoints > 0 && (
              <div className="absolute top-0 right-0 p-4">
                  <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full flex items-center animate-bounce">
                      <Gift size={14} className="mr-1" /> +{earnedPoints} Points
                  </div>
              </div>
          )}
          
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">অর্ডার কনফার্মড!</h2>
          <p className="text-gray-500 mb-6">ধন্যবাদ, আপনার অর্ডারটি সফলভাবে অনলাইন ডাটাবেসে সেভ হয়েছে। শীঘ্রই আমরা যোগাযোগ করবো।</p>
          
          {earnedPoints > 0 && (
             <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl mb-8 border border-yellow-100">
                <p className="font-bold text-gray-800 flex justify-center items-center">
                    <Gift className="text-orange-500 mr-2" /> অভিনন্দন! আপনি {earnedPoints} পয়েন্ট পেয়েছেন।
                </p>
             </div>
          )}

          <button 
            onClick={() => navigate('/')}
            className="w-full py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
          >
            হোম পেজে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
       <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">চেকআউট</h1>
       
       <form onSubmit={handlePlaceOrder} className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
         
         {/* Left: Shipping Info */}
         <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                 <User size={20} className="mr-2 text-green-600" /> আপনার তথ্য
               </h2>
               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">পুরো নাম</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      placeholder="আপনার নাম লিখুন"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ফোন নাম্বার</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                 <MapPin size={20} className="mr-2 text-green-600" /> শিপিং অ্যাড্রেস
               </h2>
               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">পূর্ণ ঠিকানা</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      placeholder="বাসা নং, রোড নং, এলাকা"
                    ></textarea>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">শহর / জেলা</label>
                     <input 
                       required
                       type="text"
                       value={formData.city}
                       onChange={e => setFormData({...formData, city: e.target.value})}
                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                       placeholder="যেমন: ঢাকা"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">নোট (অপশনাল)</label>
                     <input 
                       type="text"
                       value={formData.note}
                       onChange={e => setFormData({...formData, note: e.target.value})}
                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                       placeholder="ডেলিভারি সম্পর্কে বিশেষ কিছু বলার থাকলে..."
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* Right: Payment & Summary */}
         <div className="lg:col-span-5 space-y-6 mt-8 lg:mt-0">
            
            {/* Payment Methods */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                 <CreditCard size={20} className="mr-2 text-green-600" /> পেমেন্ট মেথড
               </h2>
               
               <div className="space-y-3">
                  {isCodAvailable && (
                    <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <div className="flex items-center">
                            <input 
                                type="radio" 
                                name="payment" 
                                value="cod" 
                                checked={paymentMethod === 'cod'} 
                                onChange={() => setPaymentMethod('cod')}
                                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <span className="ml-3 font-bold text-gray-700">ক্যাশ অন ডেলিভারি</span>
                        </div>
                    </label>
                  )}

                  <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'bkash' ? 'border-[#e2136e] bg-pink-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <div className="flex items-center">
                          <input 
                              type="radio" 
                              name="payment" 
                              value="bkash" 
                              checked={paymentMethod === 'bkash'} 
                              onChange={() => setPaymentMethod('bkash')}
                              className="h-5 w-5 text-[#e2136e] focus:ring-[#e2136e] border-gray-300"
                          />
                          <span className="ml-3 font-bold text-gray-700">বিকাশ (bKash)</span>
                      </div>
                      <div className="h-8 w-8 bg-[#e2136e] text-white rounded flex items-center justify-center text-xs font-bold">b</div>
                  </label>

                  <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'nagad' ? 'border-[#f6921e] bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <div className="flex items-center">
                          <input 
                              type="radio" 
                              name="payment" 
                              value="nagad" 
                              checked={paymentMethod === 'nagad'} 
                              onChange={() => setPaymentMethod('nagad')}
                              className="h-5 w-5 text-[#f6921e] focus:ring-[#f6921e] border-gray-300"
                          />
                          <span className="ml-3 font-bold text-gray-700">নগদ (Nagad)</span>
                      </div>
                      <div className="h-8 w-8 bg-[#f6921e] text-white rounded flex items-center justify-center text-xs font-bold">N</div>
                  </label>

                   <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'rocket' ? 'border-[#8c3494] bg-purple-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <div className="flex items-center">
                          <input 
                              type="radio" 
                              name="payment" 
                              value="rocket" 
                              checked={paymentMethod === 'rocket'} 
                              onChange={() => setPaymentMethod('rocket')}
                              className="h-5 w-5 text-[#8c3494] focus:ring-[#8c3494] border-gray-300"
                          />
                          <span className="ml-3 font-bold text-gray-700">রকেট (Rocket)</span>
                      </div>
                      <div className="h-8 w-8 bg-[#8c3494] text-white rounded flex items-center justify-center text-xs font-bold">R</div>
                  </label>
               </div>

               {/* Mobile Banking Instructions */}
               {paymentMethod !== 'cod' && (
                   <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
                       <p className="text-sm text-gray-700 mb-3 font-medium">
                           আপনার {paymentMethod === 'bkash' ? 'বিকাশ' : paymentMethod === 'nagad' ? 'নগদ' : 'রকেট'} অ্যাপ থেকে "Send Money" অপশনটি ব্যবহার করুন।
                       </p>
                       <div className="bg-white p-3 rounded-lg border border-gray-200 text-center mb-4">
                           <span className="text-xs text-gray-500 uppercase block">মার্চেন্ট নম্বর (Personal)</span>
                           <span className="text-xl font-bold text-gray-900 tracking-wider">01700-000000</span>
                       </div>
                       <div className="space-y-3">
                           <div>
                               <label className="text-xs font-bold text-gray-600 uppercase">আপনার নম্বর</label>
                               <input 
                                 type="tel"
                                 placeholder="যে নম্বর থেকে টাকা পাঠিয়েছেন"
                                 value={senderNumber}
                                 onChange={e => setSenderNumber(e.target.value)}
                                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500 text-sm"
                               />
                           </div>
                           <div>
                               <label className="text-xs font-bold text-gray-600 uppercase">TrxID (ট্রানজেকশন আইডি)</label>
                               <input 
                                 type="text"
                                 placeholder="X9S8D7F6G5"
                                 value={transactionId}
                                 onChange={e => setTransactionId(e.target.value)}
                                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500 text-sm font-mono uppercase"
                               />
                           </div>
                       </div>
                   </div>
               )}
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">অর্ডার সামারি</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>সাবটোটাল</span>
                        <span className="font-medium text-gray-900">{CURRENCY}{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>ডেলিভারি চার্জ ({shippingLocation === 'inside' ? 'ঢাকা' : 'বাইরে'})</span>
                        <span className="font-medium text-gray-900">{CURRENCY}{shippingCost.toLocaleString()}</span>
                    </div>
                    {settings.taxRate > 0 && (
                        <div className="flex justify-between text-gray-600">
                            <span>ভ্যাট ({settings.taxRate}%)</span>
                            <span className="font-medium text-gray-900">{CURRENCY}{taxAmount.toLocaleString()}</span>
                        </div>
                    )}
                    {potentialPoints > 0 && (
                        <div className="flex justify-between text-green-600 font-medium border-t border-dashed border-green-200 pt-2">
                            <span className="flex items-center"><Gift size={14} className="mr-1"/> রিওয়ার্ড পয়েন্ট</span>
                            <span>+{potentialPoints}</span>
                        </div>
                    )}
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                        <span className="text-base font-bold text-gray-900">সর্বমোট</span>
                        <span className="text-xl font-bold text-green-600">{CURRENCY}{grandTotal.toLocaleString()}</span>
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 py-4 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex justify-center items-center disabled:opacity-70"
                >
                    {isSubmitting ? (
                      <span className="flex items-center"><Loader className="animate-spin mr-2" size={20}/> অর্ডার প্রসেস হচ্ছে...</span>
                    ) : (
                      <>কনফার্ম অর্ডার <ArrowRight size={20} className="ml-2" /></>
                    )}
                </button>
                <p className="text-xs text-gray-400 text-center mt-4">অর্ডার করার মাধ্যমে আপনি আমাদের শর্তাবলীতে রাজি হচ্ছেন।</p>
            </div>
         </div>
       </form>
    </div>
  );
};

export default Checkout;