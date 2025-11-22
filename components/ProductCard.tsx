import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
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
    e.preventDefault(); // Prevent navigation if wrapped in Link
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="relative w-full pt-[100%] bg-gray-100 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title}
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.sale_price && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </span>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{product.category}</span>
          <div className="flex items-center text-yellow-400 text-xs font-bold">
            <Star size={12} fill="currentColor" className="mr-1" />
            {product.rating}
          </div>
        </div>
        
        <h3 className="text-gray-900 font-semibold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            {product.sale_price ? (
              <>
                <span className="text-gray-400 text-sm line-through">{CURRENCY}{product.price.toFixed(2)}</span>
                <span className="text-red-600 font-bold text-xl">{CURRENCY}{product.sale_price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-gray-900 font-bold text-xl">{CURRENCY}{product.price.toFixed(2)}</span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
