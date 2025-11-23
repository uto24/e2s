import React, { useState, useMemo } from 'react';
import { useShop } from '../services/store';
import ProductCard from '../components/ProductCard';
import { Filter, Search, Tag, X } from 'lucide-react';

const Categories: React.FC = () => {
  const { products } = useShop();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(100000); // Max price default

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price <= priceRange;
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [products, selectedCategory, searchQuery, priceRange]);

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Header */}
      <div className="bg-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">আমাদের কালেকশন</h1>
          <p className="text-green-100 max-w-2xl mx-auto">
            সেরা মানের ইলেকট্রনিক্স, ফ্যাশন, এবং লাইফস্টাইল পণ্য। আপনার পছন্দের পণ্যটি খুঁজে নিন এখনই।
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            
            {/* Search (Mobile/Desktop) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="পণ্য খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Tag size={18} className="mr-2 text-green-600" /> ক্যাটাগরি
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
                      selectedCategory === category 
                        ? 'bg-green-50 text-green-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                    {selectedCategory === category && <CheckIcon />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Filter size={18} className="mr-2 text-green-600" /> প্রাইস রেঞ্জ
              </h3>
              <input
                type="range"
                min="0"
                max="100000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0</span>
                <span className="font-bold text-gray-900">{priceRange.toLocaleString()} TK</span>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedCategory === 'All' ? 'সকল পণ্য' : selectedCategory}
                <span className="ml-2 text-sm font-normal text-gray-500">({filteredProducts.length} টি পণ্য)</span>
              </h2>
              
              {/* Reset Filters */}
              {(selectedCategory !== 'All' || searchQuery !== '' || priceRange < 100000) && (
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setPriceRange(100000);
                  }}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center font-medium"
                >
                  <X size={16} className="mr-1" /> ফিল্টার মুছুন
                </button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">কোনো পণ্য পাওয়া যায়নি</h3>
                <p className="text-gray-500">অন্য ক্যাটাগরি বা কিওয়ার্ড দিয়ে চেষ্টা করুন।</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Categories;