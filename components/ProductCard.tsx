import React from 'react';
import { ShoppingCart, Star, Plus } from 'lucide-react';
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
    addToCart(product); 
  };

  const discountPercentage = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100) 
    : 0;

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full hover-trigger"
    >
      {/* Image Container */}
      <div className="relative w-full pt-[110%] bg-gray-50 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg shadow-red-500/30">
                -{discountPercentage}%
            </span>
            )}
            {product.stock <= 0 && (
                <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                    Stock Out
                </span>
            )}
        </div>

        {/* Quick Add Button (Desktop) */}
        <button 
             onClick={handleAddToCart}
             disabled={product.stock <= 0}
             className="absolute bottom-4 right-4 bg-white text-green-600 p-3 rounded-full shadow-lg hover:bg-green-600 hover:text-white transition-all duration-300 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-10 hover:scale-110 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hidden md:flex items-center justify-center"
             title="Add to Cart"
        >
             <Plus size={20} strokeWidth={3} />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{product.category}</span>
          <div className="flex items-center text-amber-400 text-xs font-bold">
            <Star size={12} fill="currentColor" className="mr-1" />
            {product.rating || '4.5'}
          </div>
        </div>
        
        <h3 className="text-gray-800 font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="mt-auto pt-2 flex items-end justify-between border-t border-gray-50">
          <div className="flex flex-col">
            {product.sale_price ? (
              <>
                <span className="text-gray-400 text-xs line-through">{CURRENCY}{product.price.toLocaleString()}</span>
                <span className="text-green-600 font-extrabold text-lg">{CURRENCY}{product.sale_price.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-gray-900 font-extrabold text-lg">{CURRENCY}{product.price.toLocaleString()}</span>
            )}
          </div>
          
          {/* Mobile Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="md:hidden p-2 bg-gray-100 text-gray-800 rounded-full hover:bg-green-600 hover:text-white transition-colors active:scale-95"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;