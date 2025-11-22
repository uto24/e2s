import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, Share2, Shield, Truck, CreditCard, DollarSign } from 'lucide-react';
import { CURRENCY } from '../constants';
import { useCart, useShop } from '../services/store';
import { Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useShop();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  
  // State for options
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(p => p.id === id);
      if (found) {
        setProduct(found);
        setSelectedSize('');
        setSelectedColor('');
      } else {
        navigate('/');
      }
    }
    window.scrollTo(0, 0);
  }, [id, navigate, products]);

  if (!product) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;

  const handleAddToCart = () => {
    setError('');
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setError('দয়া করে সাইজ সিলেক্ট করুন।');
      return;
    }
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setError('দয়া করে কালার সিলেক্ট করুন।');
      return;
    }

    addToCart(product, qty, selectedSize, selectedColor);
  };

  const sellingPrice = product.sale_price || product.price;
  const affiliateProfit = Math.max(0, sellingPrice - (product.wholesalePrice || sellingPrice));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse mb-8 lg:mb-0">
          <div className="w-full aspect-w-1 aspect-h-1 bg-gray-100 rounded-2xl overflow-hidden sm:aspect-w-2 sm:aspect-h-3 relative group">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-center object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
            />
            {product.sale_price && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                সেভ {CURRENCY}{(product.price - product.sale_price).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <div className="mb-6">
            <span className="text-sm text-red-600 font-bold uppercase tracking-wider">{product.category}</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-3 mt-1">{product.title}</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} className={i >= Math.floor(product.rating || 5) ? "text-gray-300" : ""} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviews_count || 0} রিভিউ)</span>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock > 0 ? 'স্টকে আছে' : 'স্টক আউট'}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-4xl font-bold text-gray-900 flex items-baseline">
              {product.sale_price ? (
                <>
                  <span className="text-red-600 mr-3">{CURRENCY}{product.sale_price.toLocaleString()}</span>
                  <span className="text-xl text-gray-400 line-through">{CURRENCY}{product.price.toLocaleString()}</span>
                </>
              ) : (
                <span>{CURRENCY}{product.price.toLocaleString()}</span>
              )}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">বিবরণ</h3>
            <div className="text-base text-gray-600 space-y-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
          
          {/* Variants */}
          <div className="mt-8 space-y-6">
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">সাইজ</h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded-lg py-2 px-4 flex items-center justify-center text-sm font-medium uppercase transition-all
                        ${selectedSize === size 
                          ? 'bg-red-600 border-transparent text-white shadow-md transform scale-105' 
                          : 'bg-white border-gray-200 text-gray-900 hover:border-red-300 hover:bg-red-50'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">কালার</h4>
                <div className="flex items-center space-x-4">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative p-1 rounded-full flex items-center justify-center cursor-pointer focus:outline-none transition-transform hover:scale-110
                        ${selectedColor === color ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}
                    >
                      <span 
                        className="h-10 w-10 rounded-full border border-gray-200 shadow-sm" 
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      ></span>
                    </button>
                  ))}
                </div>
                {selectedColor && <p className="text-sm text-red-600 mt-2 font-medium">সিলেক্ট করা হয়েছে: {selectedColor}</p>}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="max-w-[140px] flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-4 text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="flex-1 text-center font-bold text-gray-900 text-lg">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="p-4 text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              type="button"
              className="flex-1 bg-red-600 border border-transparent rounded-full py-4 px-8 flex items-center justify-center text-lg font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 shadow-lg shadow-red-200 transition-all transform hover:-translate-y-1"
            >
              <ShoppingCart className="mr-2" /> কার্টে যোগ করুন
            </button>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-8 space-y-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield size={18} className="text-green-500" />
              <span>১০০% অরিজিনাল পণ্য</span>
            </div>
            
            {/* Shipping & COD Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                 <Truck size={24} className="mr-3 text-red-500 mt-1" />
                 <div className="text-sm">
                   <p className="font-bold text-gray-900 mb-1">ডেলিভারি চার্জ</p>
                   <p className="text-gray-600">ঢাকা সিটি: <strong>{CURRENCY}{product.shippingFees?.inside}</strong></p>
                   <p className="text-gray-600">সারা বাংলাদেশ: <strong>{CURRENCY}{product.shippingFees?.outside}</strong></p>
                 </div>
               </div>
               <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                  {product.isCodAvailable ? (
                    <div className="flex items-center text-green-700 font-medium">
                      <CreditCard size={24} className="mr-3"/> 
                      <div>
                        <p className="font-bold text-gray-900">ক্যাশ অন ডেলিভারি</p>
                        <p className="text-xs text-gray-500">পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 font-medium">
                      <CreditCard size={24} className="mr-3"/> 
                      <span>ক্যাশ অন ডেলিভারি নেই</span>
                    </div>
                  )}
               </div>
            </div>

            {/* Affiliate Info */}
            <div className="bg-gradient-to-r from-red-50 to-white p-5 rounded-xl border border-red-100 shadow-sm">
               <div className="flex items-start">
                 <div className="bg-red-100 p-2 rounded-full mr-3">
                    <DollarSign size={20} className="text-red-600" />
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-red-900">রিসেলার / এফিলিয়েট লাভ</h4>
                   <p className="text-sm text-red-700 mt-1">
                     এই পণ্যটি বিক্রি করলে আপনার লাভ হবে: <span className="font-bold text-lg">{CURRENCY}{affiliateProfit.toLocaleString()}</span>
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;