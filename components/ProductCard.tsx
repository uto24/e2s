import React from 'react';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../services/store';
import { CURRENCY } from '../constants';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Just add base product logic, user should ideally go to detail for variants
    // But for quick add we can implement if needed, or just redirect
    addToCart(product); 
  };

  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative w-full pt-[100%] bg-gray-100 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title}
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        
        {product.sale_price && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse-soft">
            ছাড়
          </span>
        )}

        {/* Quick Actions Overlay (Desktop) */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:flex justify-center space-x-3">
           <button 
             onClick={handleAddToCart}
             className="bg-white text-red-600 p-3 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-colors"
             title="কার্টে যোগ করুন"
           >
             <ShoppingCart size={20} />
           </button>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold bg-gray-100 px-2 py-1 rounded-md">{product.category}</span>
          <div className="flex items-center text-yellow-400 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-md">
            <Star size={12} fill="currentColor" className="mr-1" />
            {product.rating || 'NEW'}
          </div>
        </div>
        
        <h3 className="text-gray-900 font-semibold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            {product.sale_price ? (
              <>
                <span className="text-gray-400 text-xs line-through">{CURRENCY}{product.price.toLocaleString()}</span>
                <span className="text-red-600 font-bold text-lg">{CURRENCY}{product.sale_price.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-gray-900 font-bold text-lg">{CURRENCY}{product.price.toLocaleString()}</span>
            )}
          </div>
          
          {/* Mobile Cart Button */}
          <button 
            onClick={handleAddToCart}
            className="md:hidden p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-sm"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;