import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, User, UserRole, AppSettings, Review, Order } from '../types';
import { DEFAULT_SETTINGS, MOCK_ORDERS } from '../constants';
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
import { auth, googleProvider } from './firebase';

// --- Shop Context ---
interface ShopContextType {
  products: Product[];
  orders: Order[]; // Added orders to context interface
  settings: AppSettings;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (newSettings: AppSettings) => void;
  addReview: (productId: string, review: Review) => void;
  placeOrder: (order: Order) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  // Initialize orders with empty array initially
  const [orders, setOrders] = useState<Order[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('e2s_products');
    const savedSettings = localStorage.getItem('e2s_settings');
    const savedOrders = localStorage.getItem('e2s_orders'); // Load saved orders
    
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) { console.error("Failed to parse products", e); }
    }
    
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) { console.error("Failed to parse settings", e); }
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) { console.error("Failed to parse orders", e); }
    } else {
      // Use MOCK_ORDERS as initial data if no local data exists
      setOrders(MOCK_ORDERS);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('e2s_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('e2s_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist orders whenever they change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('e2s_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const addReview = (productId: string, review: Review) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedReviews = [review, ...(p.reviews || [])];
        // Recalculate rating
        const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));
        
        return {
          ...p,
          reviews: updatedReviews,
          reviews_count: updatedReviews.length,
          rating: newRating
        };
      }
      return p;
    }));
  };

  const placeOrder = async (order: Order) => {
      // Update local state
      setOrders(prev => [order, ...prev]);
      return Promise.resolve();
  };

  return (
    <ShopContext.Provider value={{ products, orders, settings, addProduct, updateProduct, deleteProduct, updateSettings, addReview, placeOrder }}>
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
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "admin@e2s.com";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapUser = (fbUser: FirebaseUser): User => {
    const role = fbUser.email === ADMIN_EMAIL ? UserRole.ADMIN : UserRole.USER;
    // Try to retrieve extended info from local storage for now (mocking DB)
    const storedExtra = localStorage.getItem(`user_extra_${fbUser.uid}`);
    const extra = storedExtra ? JSON.parse(storedExtra) : {};

    return {
      uid: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
      email: fbUser.email || '',
      role: role,
      affiliate_id: fbUser.uid.substring(0, 8),
      balance: 0,
      avatar: fbUser.photoURL || `https://ui-avatars.com/api/?name=${fbUser.displayName || 'User'}`,
      joinedAt: fbUser.metadata.creationTime,
      phone: extra.phone || '',
      address: extra.address || ''
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(mapUser(currentUser));
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
        setUser(mapUser({ ...auth.currentUser, displayName: name }));
      }
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const updateUserProfile = async (data: { name?: string; password?: string; phone?: string; address?: string }) => {
    if (!auth.currentUser) throw new Error("No user logged in");
    
    try {
      if (data.name) {
        await updateProfile(auth.currentUser, { displayName: data.name });
      }
      if (data.password) {
        await updatePassword(auth.currentUser, data.password);
      }
      
      // Store extra fields in local storage to persist them for this demo
      const currentExtra = localStorage.getItem(`user_extra_${auth.currentUser.uid}`);
      const newExtra = {
          ...(currentExtra ? JSON.parse(currentExtra) : {}),
          ...(data.phone && { phone: data.phone }),
          ...(data.address && { address: data.address })
      };
      localStorage.setItem(`user_extra_${auth.currentUser.uid}`, JSON.stringify(newExtra));
      
      // Update local state
      setUser(prev => prev ? { 
          ...prev, 
          name: data.name || prev.name,
          phone: data.phone || prev.phone,
          address: data.address || prev.address
      } : null);
    } catch (error) {
      console.error("Profile update failed", error);
      throw error;
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