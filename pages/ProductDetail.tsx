import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, Shield, Truck, CreditCard, DollarSign, ChevronRight, Share2, Info, Box, CornerUpLeft, Check, Facebook, MessageCircle, Send, Link as LinkIcon } from 'lucide-react';
import { CURRENCY } from '../constants';
import { useCart, useShop, useAuth } from '../services/store';
import { Product, UserRole, Review } from '../types';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, addReview } = useShop();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'desc' | 'shipping' | 'reviews'>('desc');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Review State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(p => p.id === id);
      if (found) {
        setProduct(found);
        setMainImage(found.image);
        setSelectedSize('');
        setSelectedColor('');
        setQty(1);
        window.scrollTo(0, 0);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate, products]);

  if (!product) return <div className="flex justify-center items-center h-screen bg-white"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div></div>;

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareSocial = (platform: 'facebook' | 'whatsapp') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${product.title} on E-Shop!`);
    
    if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'whatsapp') {
        window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
    }
    setShowShareMenu(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmittingReview(true);
    const newReview: Review = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.name,
      userAvatar: user.avatar,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString()
    };

    setTimeout(() => {
      addReview(product.id, newReview);
      setReviewComment('');
      setReviewRating(5);
      setIsSubmittingReview(false);
      // Manually update local product state to show review immediately without re-fetch
      setProduct(prev => prev ? {
          ...prev,
          reviews: [newReview, ...(prev.reviews || [])],
          reviews_count: (prev.reviews_count || 0) + 1,
          rating: parseFloat((((prev.rating * (prev.reviews_count || 0)) + reviewRating) / ((prev.reviews_count || 0) + 1)).toFixed(1))
      } : null);
    }, 500);
  };

  const sellingPrice = product.sale_price || product.price;
  const affiliateProfit = Math.max(0, sellingPrice - (product.wholesalePrice || sellingPrice));
  const isReseller = user?.role === UserRole.AFFILIATE || user?.role === UserRole.SELLER || user?.role === UserRole.ADMIN;
  
  // Fallback gallery if no extra images provided
  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image, product.image, product.image];

  const reviews = product.reviews || [];

  return (
    <div className="bg-gray-50 min-h-screen pb-12 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm font-medium text-gray-500">
            <Link to="/" className="hover:text-green-600 transition-colors">হোম</Link>
            <ChevronRight size={16} className="mx-2" />
            <Link to="/categories" className="hover:text-green-600 transition-colors">{product.category}</Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-900 truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          
          {/* Left Column: Images */}
          <div className="flex flex-col space-y-4">
            <div 
              className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200 group shadow-sm cursor-crosshair"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={mainImage}
                alt={product.title}
                className={`w-full h-full object-contain p-4 transition-transform duration-200 ${isZooming ? 'opacity-0' : 'opacity-100'}`}
              />
              {isZooming && (
                <div 
                  className="absolute inset-0 bg-no-repeat pointer-events-none"
                  style={{
                    backgroundImage: `url(${mainImage})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: '250%'
                  }}
                />
              )}
              
              {product.sale_price && (
                <span className="absolute top-4 left-4 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg z-10">
                  - {Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-5 gap-2">
               {galleryImages.map((img, i) => (
                 <button 
                   key={i} 
                   onClick={() => setMainImage(img)}
                   className={`aspect-square rounded-xl border overflow-hidden hover:border-green-500 transition-all focus:ring-2 focus:ring-green-500 bg-white ${mainImage === img ? 'border-green-600 ring-2 ring-green-200' : 'border-gray-200'}`}
                 >
                   <img src={img} alt="" className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="mt-10 lg:mt-0 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 relative">
              <div className="flex justify-between items-start">
                <div>
                   <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">{product.title}</h1>
                   <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="ml-1 font-bold text-gray-700">{product.rating || 0}</span>
                      <span className="text-gray-400 text-xs ml-1">({product.reviews_count} reviews)</span>
                    </div>
                    <span className="text-sm text-gray-400">|</span>
                    <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? 'স্টকে আছে' : 'স্টক আউট'}
                    </span>
                  </div>
                </div>
                
                {/* Share Button */}
                <div className="relative">
                    <button 
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 rounded-full bg-gray-50 hover:bg-green-50 hover:text-green-600 transition-colors text-gray-500"
                    title="শেয়ার করুন"
                    >
                    <Share2 size={24} />
                    </button>
                    
                    {showShareMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 animate-fade-in overflow-hidden">
                            <button onClick={handleCopyLink} className="w-full text-left px-4 py-3 flex items-center hover:bg-gray-50 text-sm text-gray-700">
                                {copied ? <Check size={16} className="mr-3 text-green-600"/> : <LinkIcon size={16} className="mr-3 text-gray-500"/>}
                                {copied ? 'লিংক কপি হয়েছে' : 'লিংক কপি করুন'}
                            </button>
                            <button onClick={() => handleShareSocial('facebook')} className="w-full text-left px-4 py-3 flex items-center hover:bg-blue-50 text-sm text-gray-700">
                                <Facebook size={16} className="mr-3 text-blue-600"/> ফেসবুকে শেয়ার
                            </button>
                            <button onClick={() => handleShareSocial('whatsapp')} className="w-full text-left px-4 py-3 flex items-center hover:bg-green-50 text-sm text-gray-700">
                                <MessageCircle size={16} className="mr-3 text-green-500"/> হোয়াটসঅ্যাপ
                            </button>
                        </div>
                    )}
                </div>
              </div>

              {/* Price Block */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">মূল্য</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-green-600">{CURRENCY}{sellingPrice.toLocaleString()}</span>
                    {product.sale_price && (
                      <span className="text-lg text-gray-400 line-through decoration-red-300">{CURRENCY}{product.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                {/* Reseller/Affiliate Block */}
                {isReseller && (
                  <div className="text-right bg-green-100 px-4 py-2 rounded-lg border border-green-200">
                     <p className="text-xs text-green-800 font-bold uppercase tracking-wide">রিসেলার প্রাইস</p>
                     <p className="text-xl font-bold text-gray-900">{CURRENCY}{product.wholesalePrice?.toLocaleString()}</p>
                     <p className="text-xs text-green-700 font-medium mt-1 flex items-center justify-end">
                       লাভ: {CURRENCY}{affiliateProfit.toLocaleString()} <DollarSign size={12} className="ml-1" />
                     </p>
                  </div>
                )}
              </div>

              {/* Variants */}
              <div className="space-y-5 mb-8">
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">সাইজ</span>
                      <button className="text-xs text-green-600 hover:underline">সাইজ গাইড</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`h-10 min-w-[40px] px-3 rounded-lg border text-sm font-medium transition-all ${
                            selectedSize === size 
                              ? 'border-green-600 bg-green-600 text-white shadow-md' 
                              : 'border-gray-200 bg-white text-gray-900 hover:border-green-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors && product.colors.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-900 block mb-2">কালার: <span className="text-gray-500 font-normal">{selectedColor || 'Select'}</span></span>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedColor === color ? 'border-green-600 scale-110' : 'border-transparent hover:scale-105'
                          }`}
                        >
                          <span 
                            className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center animate-pulse">
                  <Info size={16} className="mr-2" /> {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-gray-300 rounded-full sm:w-32">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 text-gray-600 hover:text-green-600 transition-colors"><Minus size={18} /></button>
                  <input type="text" readOnly value={qty} className="w-full text-center font-bold text-gray-900 bg-transparent outline-none" />
                  <button onClick={() => setQty(qty + 1)} className="p-3 text-gray-600 hover:text-green-600 transition-colors"><Plus size={18} /></button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-4 rounded-full font-bold text-lg shadow-lg shadow-green-100 flex items-center justify-center transition-all transform hover:-translate-y-1 ${
                    product.stock > 0 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={20} className="mr-2" />
                  {product.stock > 0 ? 'কার্টে যোগ করুন' : 'স্টক আউট'}
                </button>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t border-gray-100 pt-6">
                <div className="flex items-center"><Shield size={18} className="text-green-500 mr-2"/> ১০০% অরিজিনাল</div>
                <div className="flex items-center"><Truck size={18} className="text-green-500 mr-2"/> দ্রুত ডেলিভারি</div>
                <div className="flex items-center"><CornerUpLeft size={18} className="text-green-500 mr-2"/> ৭ দিনের রিটার্ন</div>
                <div className="flex items-center"><CreditCard size={18} className="text-green-500 mr-2"/> {product.isCodAvailable ? 'COD আছে' : 'COD নেই'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description, Info, Reviews */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveTab('desc')}
              className={`px-8 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'desc' ? 'border-green-600 text-green-600 bg-green-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              পণ্যের বিবরণ
            </button>
            <button 
              onClick={() => setActiveTab('shipping')}
              className={`px-8 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'shipping' ? 'border-green-600 text-green-600 bg-green-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              ডেলিভারি তথ্য
            </button>
             <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'reviews' ? 'border-green-600 text-green-600 bg-green-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              রিভিউ ({reviews.length})
            </button>
          </div>
          <div className="p-8">
            {activeTab === 'desc' && (
              <div className="animate-fade-in">
                <div className="prose prose-green max-w-none text-gray-600 leading-relaxed mb-10">
                  <p dangerouslySetInnerHTML={{ __html: product.description }}></p>
                </div>
                
                {/* Product Specifications Table */}
                <div className="border rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b font-bold text-gray-900">পণ্য স্পেসিফিকেশন</div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                       <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-500 w-1/3">ক্যাটাগরি</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{product.category}</td>
                       </tr>
                       {product.sizes && product.sizes.length > 0 && (
                         <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-500">সাইজ</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{product.sizes.join(', ')}</td>
                         </tr>
                       )}
                       {product.colors && product.colors.length > 0 && (
                         <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-500">কালার</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{product.colors.join(', ')}</td>
                         </tr>
                       )}
                       <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-500">স্টক স্ট্যাটাস</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{product.stock > 0 ? 'স্টকে আছে' : 'আউট অফ স্টক'}</td>
                       </tr>
                       <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-500">SKU</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-mono">{product.id.toUpperCase()}</td>
                       </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center"><Truck className="mr-2 text-green-600" /> শিপিং রেট</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-gray-600">ঢাকা সিটির ভিতরে</span>
                      <span className="font-bold text-gray-900">{CURRENCY}{product.shippingFees?.inside}</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-gray-600">সারা বাংলাদেশ</span>
                      <span className="font-bold text-gray-900">{CURRENCY}{product.shippingFees?.outside}</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center"><Box className="mr-2 text-green-600" /> ডেলিভারি সময় ও রিটার্ন পলিসি</h3>
                  <p className="text-gray-600 mb-2">আমরা দ্রুততম সময়ে পণ্য পৌঁছে দেওয়ার চেষ্টা করি।</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2 mb-4">
                    <li>ঢাকা সিটি: ২৪-৪৮ ঘন্টা</li>
                    <li>ঢাকার বাইরে: ৩-৫ দিন</li>
                  </ul>
                  <div className="bg-green-50 p-3 rounded-lg text-sm text-green-800 border border-green-100">
                    <strong>রিটার্ন পলিসি:</strong> পণ্য হাতে পাওয়ার পর কোনো সমস্যা থাকলে ৭ দিনের মধ্যে রিটার্ন করতে পারবেন।
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
                <div className="animate-fade-in">
                    <div className="grid md:grid-cols-12 gap-8">
                        {/* Review Form (Left Side on Desktop) */}
                        <div className="md:col-span-4">
                             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">আপনার মতামত দিন</h3>
                                {user ? (
                                    <form onSubmit={handleSubmitReview}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">রেটিং</label>
                                            <div className="flex space-x-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setReviewRating(star)}
                                                        className="focus:outline-none transition-transform hover:scale-110"
                                                    >
                                                        <Star 
                                                            size={28} 
                                                            className={star <= reviewRating ? "text-yellow-400 fill-current" : "text-gray-300"} 
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">আপনার মন্তব্য</label>
                                            <textarea
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                rows={4}
                                                required
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
                                                placeholder="পণ্যের মান কেমন ছিল?"
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={isSubmittingReview}
                                            className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex justify-center items-center"
                                        >
                                            {isSubmittingReview ? 'সাবমিট হচ্ছে...' : <><Send size={16} className="mr-2" /> রিভিউ সাবমিট করুন</>}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                                        <p className="text-gray-600 text-sm mb-3">রিভিউ দেওয়ার জন্য লগ ইন করুন</p>
                                        <Link to="/login" className="text-green-600 font-bold hover:underline">লগ ইন করুন</Link>
                                    </div>
                                )}
                             </div>
                        </div>

                        {/* Review List (Right Side) */}
                        <div className="md:col-span-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">কাস্টমার রিভিউ ({reviews.length})</h3>
                            {reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden mr-3">
                                                        {review.userAvatar ? (
                                                            <img src={review.userAvatar} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="font-bold text-sm">{review.userName.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{review.userName}</p>
                                                        <p className="text-xs text-gray-500">{review.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                     {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-200"} />
                                                     ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed ml-13 pl-13">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <Star size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500">এখনও কোনো রিভিউ নেই। আপনিই প্রথম রিভিউ দিন!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
             <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-bold text-gray-900">আপনি পছন্দ করতে পারেন</h2>
                 <Link to="/categories" className="text-green-600 font-medium hover:underline flex items-center">
                    আরও দেখুন <ChevronRight size={16} />
                 </Link>
             </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;