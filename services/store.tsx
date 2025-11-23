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
  getDoc 
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
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);

  // Real-time Listeners
  useEffect(() => {
    // Products
    const qProducts = query(collection(db, "products"));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        productsData.push({ ...doc.data(), id: doc.id } as Product);
      });
      setProducts(productsData);
    });

    // Orders
    const qOrders = query(collection(db, "orders"), orderBy("date", "desc"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({ ...doc.data(), id: doc.id } as Order); // Ensure ID maps to Firestore ID
      });
      setOrders(ordersData);
    });

    // Settings
    const unsubSettings = onSnapshot(doc(db, "settings", "global"), (doc) => {
      if (doc.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...doc.data() as AppSettings });
      } else {
        // Create default settings if not exists
        setDoc(doc.ref, DEFAULT_SETTINGS);
      }
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubSettings();
    };
  }, []);

  const addProduct = async (product: Product) => {
    // Remove ID so Firestore generates it, or use setDoc if ID is pre-generated
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
    // Remove ID so Firestore can generate a unique one, or keep custom ID logic if preferred
    // Here we let Firestore generate the ID to avoid collisions
    const { id, ...orderData } = order;
    await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: new Date().toISOString() // Helper for sorting
    });
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await updateDoc(doc(db, "orders", orderId), { status });
  };

  const refreshData = () => {
    // No-op for Firestore real-time listeners
    console.log("Data refreshed automatically via listeners");
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
      refreshData 
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

  // Sync Firebase User with Firestore User Data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          // Merge Auth data with Firestore data
          const firestoreData = userSnap.data();
          setUser({
            uid: currentUser.uid,
            email: currentUser.email || '',
            name: currentUser.displayName || firestoreData.name || 'User',
            avatar: currentUser.photoURL || firestoreData.avatar || `https://ui-avatars.com/api/?name=${currentUser.displayName || 'User'}`,
            role: firestoreData.role || (currentUser.email === ADMIN_EMAIL ? UserRole.ADMIN : UserRole.USER),
            affiliate_id: firestoreData.affiliate_id || currentUser.uid.substring(0, 8),
            balance: firestoreData.balance || 0,
            points: firestoreData.points || 0,
            joinedAt: currentUser.metadata.creationTime,
            phone: firestoreData.phone || '',
            address: firestoreData.address || ''
          });
        } else {
          // Create new user doc
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
            address: ''
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
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
        // The onAuthStateChanged listener will handle creating the Firestore doc
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

// --- Cart Context (Remains LocalStorage for now as it's temporary per session) ---
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
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

  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      );

      if (existingIndex > -1) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      }
      
      const newItem: CartItem = {
        ...product,
        quantity,
        selectedSize: size,
        selectedColor: color,
        cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
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
    setItems(prev => prev.map(item => 
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => {
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