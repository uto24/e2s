

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, User, UserRole, AppSettings, Review, Order } from '../types';
import { DEFAULT_SETTINGS, PRODUCTS as DEFAULT_PRODUCTS } from '../constants';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  updatePassword,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  setDoc, 
  getDoc,
  writeBatch,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

// --- Shop Context ---
interface ShopContextType {
  products: Product[];
  orders: Order[];
  settings: AppSettings;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateSettings: (newSettings: AppSettings) => Promise<void>;
  addReview: (productId: string, review: Review) => Promise<void>;
  placeOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  refreshData: () => void;
  seedDatabase: () => Promise<void>;
  // Affiliate Logic
  submitAffiliateApplication: (data: any) => Promise<void>;
  getPendingAffiliates: () => Promise<User[]>;
  reviewAffiliate: (userId: string, action: 'approve' | 'reject') => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);

  // Real-time Listeners
  useEffect(() => {
    // Products Listener
    const qProducts = query(collection(db, "products"));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        productsData.push({ ...doc.data(), id: doc.id } as Product);
      });
      setProducts(productsData);
    }, (error) => {
      console.error("Error fetching products from DB:", error);
    });

    // Orders Listener
    const qOrders = query(collection(db, "orders"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({ ...doc.data(), id: doc.id } as Order); 
      });
      
      ordersData.sort((a, b) => {
        const dateA = new Date((a as any).createdAt || a.date).getTime();
        const dateB = new Date((b as any).createdAt || b.date).getTime();
        return dateB - dateA;
      });
      
      setOrders(ordersData);
    }, (error) => {
      console.error("Error fetching orders from DB:", error);
    });

    // Settings Listener
    const unsubSettings = onSnapshot(doc(db, "settings", "global"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        // Deep merge logic simplified: overwrite top-level keys
        setSettings(prev => ({ 
            ...DEFAULT_SETTINGS, 
            ...data,
            campaign: { ...DEFAULT_SETTINGS.campaign, ...(data.campaign || {}) },
            popup: { ...DEFAULT_SETTINGS.popup, ...(data.popup || {}) }
        } as AppSettings));
      } else {
        setDoc(doc.ref, DEFAULT_SETTINGS);
      }
    }, (error) => {
      console.error("Error fetching settings:", error);
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubSettings();
    };
  }, []);

  const addProduct = async (product: Product) => {
    const { id, ...rest } = product; 
    await addDoc(collection(db, "products"), rest);
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    await updateDoc(doc(db, "products", id), data);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
  };

  const updateSettings = async (newSettings: AppSettings) => {
    await setDoc(doc(db, "settings", "global"), newSettings);
  };

  const addReview = async (productId: string, review: Review) => {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      const product = productSnap.data() as Product;
      const updatedReviews = [review, ...(product.reviews || [])];
      const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      const newRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));
      
      await updateDoc(productRef, {
        reviews: updatedReviews,
        reviews_count: updatedReviews.length,
        rating: newRating
      });
    }
  };

  const placeOrder = async (order: Order) => {
    await setDoc(doc(db, "orders", order.id), {
      ...order,
      createdAt: new Date().toISOString() 
    });
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await updateDoc(doc(db, "orders", orderId), { status });
    
    // Check if status is 'delivered' and apply commission
    // CRITICAL: Check commissionPaid flag to prevent double payment
    if (status === 'delivered') {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);
        
        if (orderSnap.exists()) {
            const orderData = orderSnap.data() as Order;
            
            // If reseller profit exists AND it hasn't been paid yet
            if (orderData.affiliateId && 
                orderData.totalResellerProfit && 
                orderData.totalResellerProfit > 0 && 
                !orderData.commissionPaid
            ) {
                 const qUser = query(collection(db, "users"), where("affiliate_id", "==", orderData.affiliateId));
                 const userSnaps = await getDocs(qUser);
                 
                 if (!userSnaps.empty) {
                     const userDoc = userSnaps.docs[0];
                     const userData = userDoc.data() as User;
                     
                     // 1. Update Affiliate Balance
                     await updateDoc(userDoc.ref, {
                         balance: (userData.balance || 0) + orderData.totalResellerProfit
                     });
                     
                     // 2. Mark order as commission paid so we don't pay again
                     await updateDoc(orderRef, {
                         commissionPaid: true
                     });

                     console.log(`Commission of ${orderData.totalResellerProfit} paid to affiliate ${orderData.affiliateId}`);
                 }
            }
        }
    }
  };

  // Affiliate Logic
  const submitAffiliateApplication = async (data: any) => {
    if (!auth.currentUser) throw new Error("User must be logged in");
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
        affiliateStatus: 'pending',
        affiliateInfo: data
    });
  };

  const getPendingAffiliates = async () => {
      const q = query(collection(db, "users"), where("affiliateStatus", "==", "pending"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({...d.data(), uid: d.id} as User));
  };

  const reviewAffiliate = async (userId: string, action: 'approve' | 'reject') => {
      await updateDoc(doc(db, "users", userId), {
          affiliateStatus: action === 'approve' ? 'approved' : 'rejected',
          role: action === 'approve' ? UserRole.AFFILIATE : UserRole.USER
      });
  };

  const refreshData = () => {
    console.log("Data is synchronized with Firestore.");
  };

  const seedDatabase = async () => {
    const batch = writeBatch(db);
    console.log("Seeding products...");
    DEFAULT_PRODUCTS.forEach(p => {
      const { id, ...data } = p; 
      const ref = doc(collection(db, "products")); 
      batch.set(ref, data);
    });
    const settingsRef = doc(db, "settings", "global");
    batch.set(settingsRef, DEFAULT_SETTINGS, { merge: true });
    await batch.commit();
    console.log("Database seeded successfully!");
  };

  return (
    <ShopContext.Provider value={{ 
      products, 
      orders, 
      settings, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      updateSettings, 
      addReview, 
      placeOrder, 
      updateOrderStatus,
      refreshData,
      seedDatabase,
      submitAffiliateApplication,
      getPendingAffiliates,
      reviewAffiliate
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  updateUserProfile: (data: { name?: string; password?: string; phone?: string; address?: string }) => Promise<void>;
  addPoints: (points: number) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "admin@e2s.com";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const firestoreData = userSnap.data();
          setUser({
            uid: currentUser.uid,
            email: currentUser.email || '',
            name: firestoreData.name || currentUser.displayName || 'User',
            avatar: firestoreData.avatar || currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName || 'User'}`,
            role: firestoreData.role || (currentUser.email === ADMIN_EMAIL ? UserRole.ADMIN : UserRole.USER),
            affiliate_id: firestoreData.affiliate_id || currentUser.uid.substring(0, 8),
            balance: firestoreData.balance || 0,
            points: firestoreData.points || 0,
            joinedAt: firestoreData.joinedAt || currentUser.metadata.creationTime,
            phone: firestoreData.phone || '',
            address: firestoreData.address || '',
            affiliateStatus: firestoreData.affiliateStatus || 'none',
            affiliateInfo: firestoreData.affiliateInfo || null
          });
        } else {
          const newUser: User = {
            uid: currentUser.uid,
            name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email || '',
            role: currentUser.email === ADMIN_EMAIL ? UserRole.ADMIN : UserRole.USER,
            affiliate_id: currentUser.uid.substring(0, 8),
            balance: 0,
            points: 0,
            avatar: currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName || 'User'}`,
            joinedAt: currentUser.metadata.creationTime,
            phone: '',
            address: '',
            affiliateStatus: 'none'
          };
          await setDoc(userRef, newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google login failed", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Email login failed", error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const updateUserProfile = async (data: { name?: string; password?: string; phone?: string; address?: string }) => {
    if (!auth.currentUser || !user) throw new Error("No user logged in");
    
    try {
      const updates: any = {};
      
      if (data.name) {
        await updateProfile(auth.currentUser, { displayName: data.name });
        updates.name = data.name;
      }
      if (data.password) {
        await updatePassword(auth.currentUser, data.password);
      }
      if (data.phone) updates.phone = data.phone;
      if (data.address) updates.address = data.address;

      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, "users", user.uid), updates);
        setUser(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error("Profile update failed", error);
      throw error;
    }
  };

  const addPoints = async (amount: number) => {
    if (!auth.currentUser || !user) return;
    
    try {
      const newPoints = (user.points || 0) + amount;
      await updateDoc(doc(db, "users", user.uid), {
        points: newPoints
      });
      setUser(prev => prev ? { ...prev, points: newPoints } : null);
    } catch (error) {
      console.error("Failed to add points", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginWithGoogle, 
      loginWithEmail, 
      registerWithEmail,
      updateUserProfile,
      addPoints,
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// --- Cart Context ---
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string, affiliateInfo?: { aid: string; customPrice: number }) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('e2s_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('e2s_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1, size?: string, color?: string, affiliateInfo?: { aid: string; customPrice: number }) => {
    setItems(prev => {
      // Check if item exists with same ID, size, color AND same price/affiliate
      // If a reseller link is used, it should probably start a new cart line item if price differs
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color &&
        item.sourceAffiliateId === affiliateInfo?.aid &&
        (affiliateInfo?.customPrice ? (item.sale_price === affiliateInfo.customPrice || item.price === affiliateInfo.customPrice) : true)
      );

      if (existingIndex > -1) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += quantity;
        
        // Recalculate profit if quantity changes
        if(newItems[existingIndex].sourceAffiliateId && newItems[existingIndex].sale_price) {
           const unitProfit = (newItems[existingIndex].sale_price! - (product.wholesalePrice || product.price));
           newItems[existingIndex].resellerProfit = unitProfit * newItems[existingIndex].quantity;
        }

        return newItems;
      }
      
      // Calculate profit if this is a reseller sale
      let resellerProfit = 0;
      let finalProduct = { ...product };

      if (affiliateInfo) {
          finalProduct.sale_price = affiliateInfo.customPrice; // Override sale price with reseller price
          const wholesale = product.wholesalePrice || product.price; // Fallback
          resellerProfit = Math.max(0, affiliateInfo.customPrice - wholesale);
      }

      const newItem: CartItem = {
        ...finalProduct,
        quantity,
        selectedSize: size,
        selectedColor: color,
        cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        sourceAffiliateId: affiliateInfo?.aid,
        resellerProfit: resellerProfit * quantity // Initial total profit for this line item
      };
      
      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
          // Recalculate profit if quantity changes
          let unitProfit = 0;
          if(item.resellerProfit) {
               unitProfit = item.resellerProfit / item.quantity;
          }
          
          return { 
              ...item, 
              quantity, 
              resellerProfit: unitProfit * quantity 
          };
      }
      return item;
    }));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => {
    // If sale_price exists (which might be reseller price), use it.
    const price = item.sale_price || item.price;
    return sum + price * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
