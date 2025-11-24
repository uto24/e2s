
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, Shield, Truck, CreditCard, ChevronRight, Share2, Box, Check, Facebook, AlertTriangle } from 'lucide-react';
import { CURRENCY } from '../constants';
import { useCart, useShop, useAuth } from '../services/store';
import { Product, Review } from '../types';
import ProductCard from '../components/ProductCard';
import { decryptResellerData } from '../utils/secureLink';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
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
  const [mainImage, setMainImage] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Reseller Data State
  const [resellerData, setResellerData] = useState<{ aid: string; price: number } | null>(null);

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
        
        // Check for encrypted reseller link
        const ref = searchParams.get('r');
        if (ref) {
            const decoded = decryptResellerData(ref);
            if (decoded) {
                console.log("Reseller Link Detected:", decoded);
                setResellerData({ aid: decoded.aid, price: decoded.p });
            }
        }
        
        window.scrollTo(0, 0);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate, products, searchParams]);

  if (!product) return <div className="flex justify-center items-center h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div>;

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
    
    // Add to cart with reseller info if available
    addToCart(
        product, 
        qty, 
        selectedSize, 
        selectedColor, 
        resellerData ? { aid: resellerData.aid, customPrice: resellerData.price } : undefined
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowShareMenu(false);
    }, 2000);
  };

  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

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
      // Optimistic update
      setProduct(prev => prev ? {
          ...prev,
          reviews: [newReview, ...(prev.reviews || [])],
          reviews_count: (prev.reviews_count || 0) + 1,
          rating: parseFloat((((prev.rating * (prev.reviews_count || 0)) + reviewRating) / ((prev.reviews_count || 0) + 1)).toFixed(1))
      } : null);
    }, 500);
  };

  // Determine displayed price
  // If reseller data exists, ALWAYS show that price and hide sale badges to avoid confusion
  const displayPrice = resellerData ? resellerData.price : (product.sale_price || product.price);
  const showDiscount = !resellerData && product.sale_price;

  return (
    <div className="bg-slate-50 min-h-screen pb-12 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm font-medium text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link to="/" className="hover:text-green-600 transition-colors">হোম</Link>
            <ChevronRight size={14} className="mx-2 text-gray-300" />
            <Link to="/categories" className="hover:text-green-600 transition-colors">{product.category}</Link>
            <ChevronRight size={14} className="mx-2 text-gray-300" />
            <span className="text-gray-900 truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          
          {/* Left Column: Images (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4 animate-slide-up">
            <div 
              className="relative w-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm group"
            >
              <div className="aspect-[4/3] w-full flex items-center justify-center p-4 bg-white relative">
                 {/* Share Button */}
                <div className="absolute top-4 right-4 z-20">
                    <div className="relative">
                        <button 
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className="p-2 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-green-50 text-gray-600 hover:text-green-600 transition-all"
                        >
                            <Share2 size={20} />
                        </button>
                        {showShareMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 animate-scale-in z-30">
                                <button onClick={handleCopyLink} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center">
                                    {copied ? <Check size={16} className="text-green-600 mr-2"/> : <Share2 size={16} className="mr-2"/>}
                                    {copied ? 'কপি হয়েছে!' : 'লিংক কপি করুন'}
                                </button>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-blue-600 rounded-lg flex items-center">
                                    <Facebook size={16} className="mr-2"/> ফেসবুকে শেয়ার
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <img
                    src={mainImage}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                />
              </div>
              
              {showDiscount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg z-10 animate-pulse-glow">
                  -{Math.round(((product.price - product.sale_price!) / product.price) * 100)}% ছাড়
                </span>
              )}
            </div>
            
            {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {galleryImages.map((img, i) => (
                    <button 
                    key={i} 
                    onClick={() => setMainImage(img)}
                    className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl border-2 overflow-hidden transition-all ${
                        mainImage === img ? 'border-green-600 ring-2 ring-green-100' : 'border-gray-100 hover:border-green-300'
                    }`}
                    >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}
                </div>
            )}
            
             {/* Desktop Tabs Positioned Here for Layout Balance */}
             <div className="hidden lg:block mt-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        <button 
                            onClick={() => setActiveTab('desc')}
                            className={`flex-1 py-4 text-center font-bold text-sm transition-colors border-b-2 ${activeTab === 'desc' ? 'border-green-600 text-green-600 bg-green-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                        >
                            পণ্যের বিবরণ
                        </button>
                         <button 
                            onClick={() => setActiveTab('shipping')}
                            className={`flex-1 py-4 text-center font-bold text-sm transition-colors border-b-2 ${activeTab === 'shipping' ? 'border-green-600 text-green-600 bg-green-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                        >
                            ডেলিভারি ও রিটার্ন
                        </button>
                        <button 
                            onClick={() => setActiveTab('reviews')}
                            className={`flex-1 py-4 text-center font-bold text-sm transition-colors border-b-2 ${activeTab === 'reviews' ? 'border-green-600 text-green-600 bg-green-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                        >
                            রিভিউ ({product.reviews_count})
                        </button>
                    </div>
                    
                    <div className="p-8">
                        {activeTab === 'desc' && (
                            <div className="prose prose-green max-w-none animate-fade-in">
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                                {product.specifications && (
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="flex justify-between border-b border-gray-100 py-2">
                                                <span className="font-medium text-gray-900">{key}</span>
                                                <span className="text-gray-600">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'shipping' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex items-start">
                                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mr-4">
                                        <Truck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">ডেলিভারি চার্জ</h4>
                                        <p className="text-sm text-gray-600 mt-1">ঢাকার ভিতরে: {CURRENCY}{product.shippingFees?.inside} (২৪-৪৮ ঘন্টা)</p>
                                        <p className="text-sm text-gray-600">ঢাকার বাইরে: {CURRENCY}{product.shippingFees?.outside} (২-৫ দিন)</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-green-50 p-2 rounded-lg text-green-600 mr-4">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">ওয়ারেন্টি পলিসি</h4>
                                        <p className="text-sm text-gray-600 mt-1">৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি (ম্যানুফ্যাকচারিং ত্রুটির ক্ষেত্রে)। অবশ্যই আনবক্সিং ভিডিও থাকতে হবে।</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-purple-50 p-2 rounded-lg text-purple-600 mr-4">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">পেমেন্ট অপশন</h4>
                                        <p className="text-sm text-gray-600 mt-1">ক্যাশ অন ডেলিভারি, বিকাশ, নগদ, রকেট এবং কার্ড পেমেন্ট।</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                             <div className="animate-fade-in">
                                <div className="flex items-center mb-6">
                                    <div className="text-center pr-6 border-r border-gray-200">
                                        <div className="text-4xl font-bold text-gray-900">{product.rating}</div>
                                        <div className="flex justify-center text-amber-400 my-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500">{product.reviews_count} রিভিউ</p>
                                    </div>
                                    <div className="pl-6 flex-1">
                                         {/* Add Review Button / Form */}
                                         {user ? (
                                             <form onSubmit={handleSubmitReview} className="bg-gray-50 p-4 rounded-xl">
                                                 <p className="text-sm font-bold text-gray-700 mb-2">আপনার মতামত দিন</p>
                                                 <div className="flex mb-2 space-x-1">
                                                     {[1, 2, 3, 4, 5].map((star) => (
                                                         <button 
                                                            type="button" 
                                                            key={star} 
                                                            onClick={() => setReviewRating(star)}
                                                            className={`${star <= reviewRating ? 'text-amber-400' : 'text-gray-300'} hover:scale-110 transition-transform`}
                                                         >
                                                             <Star size={20} fill={star <= reviewRating ? "currentColor" : "none"} />
                                                         </button>
                                                     ))}
                                                 </div>
                                                 <textarea 
                                                    required
                                                    value={reviewComment}
                                                    onChange={(e) => setReviewComment(e.target.value)}
                                                    placeholder="পণ্যটি কেমন লেগেছে?"
                                                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 mb-2"
                                                    rows={2}
                                                 ></textarea>
                                                 <button 
                                                    type="submit" 
                                                    disabled={isSubmittingReview}
                                                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-700 transition-colors"
                                                 >
                                                     {isSubmittingReview ? 'পোস্ট হচ্ছে...' : 'সাবমিট করুন'}
                                                 </button>
                                             </form>
                                         ) : (
                                             <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                                                 রিভিউ দিতে দয়া করে <Link to="/login" className="text-green-600 font-bold hover:underline">লগ ইন</Link> করুন।
                                             </div>
                                         )}
                                    </div>
                                </div>

                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                    {product.reviews && product.reviews.length > 0 ? (
                                        product.reviews.map((review) => (
                                            <div key={review.id} className="flex space-x-3 pb-4 border-b border-gray-100 last:border-0">
                                                <img src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}`} alt="" className="w-10 h-10 rounded-full border border-gray-100" />
                                                <div>
                                                    <div className="flex items-center">
                                                        <h5 className="font-bold text-sm text-gray-900 mr-2">{review.userName}</h5>
                                                        <span className="text-xs text-gray-400">{review.date}</span>
                                                    </div>
                                                    <div className="flex text-amber-400 my-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} />
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-400 py-4">এখনও কোনো রিভিউ নেই।</p>
                                    )}
                                </div>
                             </div>
                        )}
                    </div>
                 </div>
             </div>

          </div>

          {/* Right Column: Product Info (5 Cols) */}
          <div className="mt-8 lg:mt-0 lg:col-span-5 lg:sticky lg:top-24 h-fit animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="mb-6">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded uppercase tracking-wider">{product.category}</span>
                    {resellerData && (
                        <span className="text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded uppercase tracking-wider animate-pulse">স্পেশাল প্রাইস</span>
                    )}
                 </div>
                 <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">{product.title}</h1>
                 
                 <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center text-amber-400">
                        <Star size={18} fill="currentColor" />
                        <span className="ml-1 text-sm font-bold text-gray-700">{product.rating}</span>
                        <span className="mx-1 text-gray-300">•</span>
                        <span className="text-sm text-gray-500 underline cursor-pointer" onClick={() => {
                            setActiveTab('reviews');
                            document.querySelector('.lg\\:hidden')?.scrollIntoView({behavior: 'smooth'});
                        }}>
                            {product.reviews_count} রিভিউ
                        </span>
                    </div>
                    {product.stock > 0 ? (
                         <div className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                            <Box size={12} className="mr-1" /> স্টক এভেইলেবল
                         </div>
                    ) : (
                        <div className="flex items-center text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-full">
                            <AlertTriangle size={12} className="mr-1" /> স্টক আউট
                         </div>
                    )}
                 </div>

                 <div className="flex items-end gap-3 border-b border-gray-100 pb-6">
                     <span className="text-4xl font-black text-gray-900 tracking-tight">
                         {CURRENCY}{displayPrice.toLocaleString()}
                     </span>
                     {showDiscount && (
                         <div className="flex flex-col mb-1">
                             <span className="text-gray-400 text-sm line-through font-medium">
                                 {CURRENCY}{product.price.toLocaleString()}
                             </span>
                         </div>
                     )}
                 </div>
              </div>

              {/* Selectors */}
              <div className="space-y-6 mb-8">
                  {product.sizes && product.sizes.length > 0 && (
                      <div>
                          <span className="text-sm font-bold text-gray-900 mb-3 block">সাইজ: {selectedSize}</span>
                          <div className="flex flex-wrap gap-3">
                              {product.sizes.map(size => (
                                  <button 
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`min-w-[3rem] h-10 px-3 rounded-lg border text-sm font-bold transition-all ${selectedSize === size ? 'border-green-600 bg-green-600 text-white shadow-md' : 'border-gray-200 text-gray-700 hover:border-green-600'}`}
                                  >
                                      {size}
                                  </button>
                              ))}
                          </div>
                      </div>
                  )}
                  
                  {product.colors && product.colors.length > 0 && (
                      <div>
                          <span className="text-sm font-bold text-gray-900 mb-3 block">কালার: {selectedColor}</span>
                          <div className="flex flex-wrap gap-3">
                              {product.colors.map(color => (
                                  <button 
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`px-4 h-10 rounded-lg border text-sm font-bold transition-all ${selectedColor === color ? 'border-green-600 bg-green-50 text-green-700 shadow-sm' : 'border-gray-200 text-gray-700 hover:border-green-600'}`}
                                  >
                                      {color}
                                  </button>
                              ))}
                          </div>
                      </div>
                  )}

                  <div>
                      <span className="text-sm font-bold text-gray-900 mb-3 block">পরিমাণ</span>
                      <div className="flex items-center w-32 border border-gray-200 rounded-xl bg-gray-50">
                          <button 
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-green-600"
                          >
                              <Minus size={16} />
                          </button>
                          <input 
                            type="text" 
                            readOnly
                            value={qty}
                            className="w-12 h-10 text-center bg-transparent font-bold text-gray-900 focus:outline-none"
                          />
                          <button 
                             onClick={() => setQty(qty + 1)}
                             className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-green-600"
                           >
                              <Plus size={16} />
                          </button>
                      </div>
                  </div>
              </div>
              
              {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-4 flex items-center animate-pulse">
                      <AlertTriangle size={16} className="mr-2" /> {error}
                  </div>
              )}

              <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                  >
                      <ShoppingCart size={20} className="mr-2" /> কার্টে যোগ করুন
                  </button>
                  <button 
                     onClick={() => {
                         handleAddToCart();
                         if(!error) navigate('/cart');
                     }}
                     disabled={product.stock <= 0}
                     className="w-full py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-xl font-bold text-lg hover:bg-gray-900 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      এখনই কিনুন
                  </button>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs font-medium text-gray-500">
                  <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                      <Shield size={14} className="mr-2 text-green-600"/> ১০০% অথেনটিক
                  </div>
                  <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                      <Truck size={14} className="mr-2 text-blue-600"/> দ্রুত ডেলিভারি
                  </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Tabs Section */}
        <div className="mt-12 lg:hidden">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('desc')}
                        className={`flex-1 min-w-[100px] py-4 text-center font-bold text-sm transition-colors border-b-2 ${activeTab === 'desc' ? 'border-green-600 text-green-600 bg-green-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                    >
                        বিবরণ
                    </button>
                        <button 
                        onClick={() => setActiveTab('shipping')}
                        className={`flex-1 min-w-[100px] py-4 text-center font-bold text-sm transition-colors border-b-2 ${activeTab === 'shipping' ? 'border-green-600 text-green-600 bg-green-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                    >
                        ডেলিভারি
                    </button>
                    <button 
                        onClick={() => setActiveTab('reviews')}
                        className={`flex-1 min-w-[100px] py-4 text-center font-bold text-sm transition-colors border-b-2 ${activeTab === 'reviews' ? 'border-green-600 text-green-600 bg-green-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                    >
                        রিভিউ ({product.reviews_count})
                    </button>
                </div>
                
                <div className="p-6">
                    {activeTab === 'desc' && (
                        <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                            {product.description}
                             {product.specifications && (
                                <div className="mt-4 space-y-2">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between border-b border-gray-50 py-1">
                                            <span className="font-bold text-gray-800">{key}</span>
                                            <span>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'shipping' && (
                         <div className="space-y-4 text-sm">
                             <p><span className="font-bold">ইনসাইড ঢাকা:</span> {CURRENCY}{product.shippingFees?.inside}</p>
                             <p><span className="font-bold">আউটসাইড ঢাকা:</span> {CURRENCY}{product.shippingFees?.outside}</p>
                             <p className="text-gray-500">ডেলিভারি সময়: ২-৫ কর্মদিবস</p>
                         </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div className="space-y-4">
                            {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-50 pb-3">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-sm">{review.userName}</span>
                                            <span className="text-xs text-gray-400">{review.date}</span>
                                        </div>
                                        <div className="flex text-amber-400 mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600">{review.comment}</p>
                                    </div>
                                ))
                            ) : <p className="text-center text-gray-400">কোনো রিভিউ নেই</p>}
                        </div>
                    )}
                </div>
             </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">রিলেটেড প্রোডাক্ট</h2>
            {relatedProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {relatedProducts.map((p, i) => (
                        <div key={p.id} className="animate-slide-up" style={{animationDelay: `${i * 100}ms`}}>
                           <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">এই ক্যাটাগরিতে অন্য কোনো পণ্য নেই।</p>
            )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
