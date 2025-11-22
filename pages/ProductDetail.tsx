import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, Share2, Shield } from 'lucide-react';
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

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(p => p.id === id);
      if (found) {
        setProduct(found);
      } else {
        // Only redirect if products are loaded but not found
        navigate('/');
      }
    }
    window.scrollTo(0, 0);
  }, [id, navigate, products]);

  if (!product) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const handleAddToCart = () => {
    for(let i = 0; i < qty; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse">
          <div className="w-full aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-center object-cover hover:scale-110 transition-transform duration-500 cursor-zoom-in"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">{product.title}</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-gray-300" : ""} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviews_count} reviews)</span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="sr-only">Product information</h2>
            <p className="text-4xl font-bold text-gray-900 flex items-baseline">
              {product.sale_price ? (
                <>
                  <span className="text-red-600 mr-3">{CURRENCY}{product.sale_price.toFixed(2)}</span>
                  <span className="text-xl text-gray-400 line-through">{CURRENCY}{product.price.toFixed(2)}</span>
                </>
              ) : (
                <span>{CURRENCY}{product.price.toFixed(2)}</span>
              )}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>

          <div className="mt-10 flex sm:flex-col1">
            <div className="max-w-xs flex items-center border border-gray-300 rounded-md">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-3 text-gray-600 hover:bg-gray-50 focus:outline-none"
              >
                <Minus size={16} />
              </button>
              <span className="flex-1 text-center font-medium text-gray-900">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="p-3 text-gray-600 hover:bg-gray-50 focus:outline-none"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              type="button"
              className="ml-4 flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-full"
            >
              <ShoppingCart className="mr-2" /> Add to cart
            </button>
            
            <button
              type="button"
              className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <Share2 size={24} />
              <span className="sr-only">Share</span>
            </button>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield size={18} className="text-green-500" />
              <span>Secure transaction via Stripe</span>
            </div>
            <div className="mt-4 bg-blue-50 p-4 rounded-lg">
               <p className="text-sm text-blue-800">
                 <strong>Affiliate Tip:</strong> Earn <span className="font-bold">{product.commission_rate * 100}% commission</span> (~{CURRENCY}{((product.sale_price || product.price) * product.commission_rate).toFixed(2)}) for every sale of this product.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;