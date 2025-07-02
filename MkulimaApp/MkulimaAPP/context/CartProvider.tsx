// context/CartProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AgriProduct = {
  id: string;
  productName: string;
  description?: string;
  price: number;
  imageUri?: string;
  tags?: string[];
  comments?: { id: string; username: string; text: string }[];
};

export type CartItem = {
  product: AgriProduct;
  quantity: number;
};

export type LastTransaction = {
  orderId: string;
  total: number;
  timestamp: string;
  items: CartItem[];
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: AgriProduct, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  lastTransaction: LastTransaction | null;
  setLastTransaction: (tx: LastTransaction | null) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};

type CartProviderProps = {
  children: ReactNode;
};

const STORAGE_CART_KEY = "@MyApp:cart";
const STORAGE_LAST_TX_KEY = "@MyApp:lastTransaction";

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastTransaction, setLastTransaction] = useState<LastTransaction | null>(null);

  // Load cart and lastTransaction from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonCart = await AsyncStorage.getItem(STORAGE_CART_KEY);
        if (jsonCart) {
          setCartItems(JSON.parse(jsonCart));
        }
        const jsonTx = await AsyncStorage.getItem(STORAGE_LAST_TX_KEY);
        if (jsonTx) {
          setLastTransaction(JSON.parse(jsonTx));
        }
      } catch (e) {
        console.error("Failed to load from storage", e);
      }
    };
    loadData();
  }, []);

  // Save cart to AsyncStorage whenever cartItems changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems)).catch((e) =>
      console.error("Failed to save cart", e)
    );
  }, [cartItems]);

  // Save lastTransaction to AsyncStorage whenever it changes
  useEffect(() => {
    if (lastTransaction) {
      AsyncStorage.setItem(STORAGE_LAST_TX_KEY, JSON.stringify(lastTransaction)).catch((e) =>
        console.error("Failed to save lastTransaction", e)
      );
    } else {
      AsyncStorage.removeItem(STORAGE_LAST_TX_KEY).catch((e) =>
        console.error("Failed to remove lastTransaction", e)
      );
    }
  }, [lastTransaction]);

  const addToCart = (product: AgriProduct, qty: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        // Increase quantity
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        return [...prev, { product, quantity: qty }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalAmount = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalAmount,
        lastTransaction,
        setLastTransaction,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
