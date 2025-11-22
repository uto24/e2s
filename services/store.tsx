import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, User, UserRole, AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

// --- Shop Context ---
interface ShopContextType {
  products: Product[];
  settings: AppSettings;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (newSettings: AppSettings) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Load data from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('e2s_products');
    const savedSettings = localStorage.getItem('e2s_settings');
    
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) { console.error("Failed to parse products", e); }
    }
    
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Merge with default to ensure new fields exist
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) { console.error("Failed to parse settings", e); }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('e2s_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('e2s_settings', JSON.stringify(settings));
  }, [settings]);

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

  return (
    <ShopContext.Provider value={{ products, settings, addProduct, updateProduct, deleteProduct, updateSettings }}>
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
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded Admin Email for demonstration
const ADMIN_EMAIL = "admin@e2s.com";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to map Firebase User to our App User
  const mapUser = (fbUser: FirebaseUser): User => {
    const role = fbUser.email === ADMIN_EMAIL ? UserRole.ADMIN : UserRole.USER;
    
    return {
      uid: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
      email: fbUser.email || '',
      role: role,
      affiliate_id: fbUser.uid.substring(0, 8), // Generate a simple affiliate ID from UID
      balance: 0, // Initial balance
      avatar: fbUser.photoURL || `https://ui-avatars.com/api/?name=${fbUser.displayName || 'User'}`
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
      // Note: In a real app, you would updateProfile to set displayName immediately
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Registration failed", error);
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

  // Load cart from local storage
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

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('e2s_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setItems(prev => {
      // Find if item with same ID and same variants exists
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      );

      if (existingIndex > -1) {
        // Update existing item
        const newItems = [...prev];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      }
      
      // Add new item
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