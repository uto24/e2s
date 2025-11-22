import React from 'react';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../services/store';
import { CURRENCY } from '../constants';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();

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
              <li key={item.id} className="flex p-6">
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
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center border rounded-md">
                       <button 
                         onClick={() => updateQuantity(item.id, item.quantity - 1)}
                         className="p-2 text-gray-600 hover:bg-gray-100"
                       >
                         <Minus size={14} />
                       </button>
                       <span className="px-4 font-medium">{item.quantity}</span>
                       <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="p-2 text-gray-600 hover:bg-gray-100"
                       >
                         <Plus size={14} />
                       </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
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
        <section className="mt-16 lg:mt-0 lg:col-span-5 bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

          <div className="flow-root">
            <dl className="-my-4 text-sm divide-y divide-gray-200">
              <div className="py-4 flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium text-gray-900">{CURRENCY}{total.toFixed(2)}</dd>
              </div>
              <div className="py-4 flex items-center justify-between">
                <dt className="text-gray-600">Shipping estimate</dt>
                <dd className="font-medium text-gray-900">{CURRENCY}5.00</dd>
              </div>
              <div className="py-4 flex items-center justify-between">
                <dt className="text-gray-600">Tax estimate (8%)</dt>
                <dd className="font-medium text-gray-900">{CURRENCY}{(total * 0.08).toFixed(2)}</dd>
              </div>
              <div className="py-4 flex items-center justify-between border-t border-gray-200">
                <dt className="text-base font-bold text-gray-900">Order total</dt>
                <dd className="text-base font-bold text-indigo-600">{CURRENCY}{(total + 5 + total * 0.08).toFixed(2)}</dd>
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
        </section>
      </div>
    </div>
  );
};

export default Cart;
