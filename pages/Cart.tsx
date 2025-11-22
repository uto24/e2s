import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, MapPin, CreditCard, AlertTriangle } from 'lucide-react';
import { useCart, useShop } from '../services/store';
import { CURRENCY } from '../constants';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { settings } = useShop();
  
  // Shipping State (Default to inside city)
  const [shippingLocation, setShippingLocation] = useState<'inside' | 'outside'>('inside');
  
  // Calculate shipping based on per-product fees
  // Sum of (Product Fee * Quantity) for each item in cart
  const shippingCost = items.reduce((sum, item) => {
    const fee = shippingLocation === 'inside' 
      ? (item.shippingFees?.inside || 0) 
      : (item.shippingFees?.outside || 0);
    return sum + (fee * item.quantity);
  }, 0);

  const taxAmount = total * (settings.taxRate / 100);
  const grandTotal = total + shippingCost + taxAmount;

  // Check if COD is available for ALL items
  const isCodAvailable = items.every(item => item.isCodAvailable);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Trash2 size={48} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any items to the cart yet.</p>
        <Link to="/" className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Cart Items List */}
        <section className="lg:col-span-7 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.cartItemId} className="flex p-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <Link to={`/product/${item.id}`}>{item.title}</Link>
                      </h3>
                      <p className="ml-4">
                        {CURRENCY}{((item.sale_price || item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                    {/* Display Variants */}
                    <div className="mt-1 text-sm text-gray-500 flex space-x-3">
                      {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                      {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                    </div>
                    {/* Display Shipping Info */}
                    <div className="mt-1 text-xs text-gray-400">
                      Delivery: {CURRENCY}{item.shippingFees?.[shippingLocation]} / item
                    </div>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm mt-2">
                    <div className="flex items-center border rounded-md">
                       <button 
                         onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                         className="p-2 text-gray-600 hover:bg-gray-100"
                       >
                         <Minus size={14} />
                       </button>
                       <span className="px-4 font-medium">{item.quantity}</span>
                       <button 
                         onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                         className="p-2 text-gray-600 hover:bg-gray-100"
                       >
                         <Plus size={14} />
                       </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="font-medium text-red-600 hover:text-red-500 flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
             <button onClick={clearCart} className="text-sm text-red-600 hover:underline">Clear Cart</button>
          </div>
        </section>

        {/* Order Summary */}
        <section className="mt-16 lg:mt-0 lg:col-span-5 space-y-4">
          
          {/* Shipping Selector */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin size={20} className="mr-2 text-indigo-600"/> Delivery Location
            </h2>
            <div className="space-y-3">
              <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${shippingLocation === 'inside' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="shipping" 
                    checked={shippingLocation === 'inside'} 
                    onChange={() => setShippingLocation('inside')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3 font-medium text-gray-900">Inside City (Special Area)</span>
                </div>
              </label>

              <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${shippingLocation === 'outside' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="shipping" 
                    checked={shippingLocation === 'outside'} 
                    onChange={() => setShippingLocation('outside')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3 font-medium text-gray-900">Outside City / Rest of Country</span>
                </div>
              </label>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
               <div className="flex items-center text-sm text-gray-600">
                 <CreditCard size={16} className="mr-2" />
                 Cash on Delivery: 
                 <span className={`font-bold ml-1 ${isCodAvailable ? 'text-green-600' : 'text-red-600'}`}>
                   {isCodAvailable ? 'Available' : 'Unavailable'}
                 </span>
               </div>
               {!isCodAvailable && (
                 <div className="mt-2 flex items-start text-xs text-red-500">
                   <AlertTriangle size={12} className="mr-1 mt-0.5" />
                   One or more items in your cart do not support Cash on Delivery.
                 </div>
               )}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

            <div className="flow-root">
              <dl className="-my-4 text-sm divide-y divide-gray-200">
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">{CURRENCY}{total.toFixed(2)}</dd>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Shipping Total</dt>
                  <dd className="font-medium text-gray-900">{CURRENCY}{shippingCost.toFixed(2)}</dd>
                </div>
                {settings.taxRate > 0 && (
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Tax ({settings.taxRate}%)</dt>
                    <dd className="font-medium text-gray-900">{CURRENCY}{taxAmount.toFixed(2)}</dd>
                  </div>
                )}
                <div className="py-4 flex items-center justify-between border-t border-gray-200">
                  <dt className="text-base font-bold text-gray-900">Order total</dt>
                  <dd className="text-base font-bold text-indigo-600">{CURRENCY}{grandTotal.toFixed(2)}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6">
              <button
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Proceed to Checkout <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                or <Link to="/" className="text-indigo-600 font-medium hover:text-indigo-500">Continue Shopping<span aria-hidden="true"> &rarr;</span></Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cart;