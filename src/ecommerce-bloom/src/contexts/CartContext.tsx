import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import type { Product } from "@/types";
import { toast } from "@/components/ui/sonner";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from "@/services/cart.service";
import { getToken } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

type CartItem = {
  product: Product;
  quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const convertApiCart = (apiCart: any): CartItem[] =>
  (apiCart.items || []).map((item: any) => ({
    product: {
      id: item.productId,
      name: item.productName,
      image: item.productImage,
      price: item.price,
    } as Product,
    quantity: item.quantity,
  }));

const CART_STORAGE_KEY = "bizdenalbizdensat_cart";

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

const loadCartFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCartFromStorage());

  const setAndPersistCart = useCallback((updater: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    setCartItems((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveCartToStorage(next);
      return next;
    });
  }, []);

  const refreshCart = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const apiCart: any = await getCart();
      const items = convertApiCart(apiCart);
      setCartItems(items);
      saveCartToStorage(items);
    } catch (error) {
      console.error("Error refreshing cart:", error);
    }
  }, []);

  // Load cart on mount — API for authenticated users, localStorage for guests
  useEffect(() => {
    const loadCart = async () => {
      const token = getToken();
      if (token) {
        try {
          const apiCart: any = await getCart();
          const items = convertApiCart(apiCart);
          setCartItems(items);
          saveCartToStorage(items);
        } catch (error) {
          console.error("Error loading cart from API:", error);
        }
      }
      // Guest users: already initialized from localStorage in useState initializer
    };
    loadCart();
  }, []);

  const { isAuthenticated } = useAuth();

  // Login: misafir sepetini API sepeti ile birleştir, ardından API sepetini göster
  // Logout: sadece localStorage'ı temizle
  useEffect(() => {
    const handleAuthChange = async () => {
      if (isAuthenticated) {
        const guestItems = loadCartFromStorage();
        try {
          // Önce misafir ürünlerini API'ye ekle (varsa)
          if (guestItems.length > 0) {
            await Promise.allSettled(
              guestItems.map((item) =>
                apiAddToCart({ productId: item.product.id, quantity: item.quantity })
              )
            );
          }
        } catch {
          // Birleştirme hatası sessizce geçilir, API sepeti yüklenmeye devam eder
        }
        await refreshCart();
      } else {
        // Çıkış: yerel sepeti sıfırla (misafir olarak boşla başla)
        setCartItems([]);
        saveCartToStorage([]);
      }
    };
    handleAuthChange();
  }, [isAuthenticated]);

  const addToCart = async (product: Product, quantity = 1) => {
    const token = getToken();

    if (token) {
      try {
        await apiAddToCart({ productId: product.id, quantity });
        await refreshCart();
        toast.success("Sepete eklendi", {
          description: `${product.name} sepetinize eklendi`,
        });
      } catch (error) {
        toast.error("Sepete ekleme hatası", {
          description: error instanceof Error ? error.message : "Ürün sepete eklenemedi",
        });
        throw error;
      }
    } else {
      setAndPersistCart((prev) => {
        const existing = prev.find((item) => item.product?.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product?.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity }];
      });
      toast.success("Sepete eklendi", {
        description: `${product.name} sepetinize eklendi`,
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    const token = getToken();

    if (token) {
      try {
        await apiRemoveFromCart(productId);
        await refreshCart();
        toast.info("Sepetten kaldırıldı", {
          description: "Ürün sepetinizden kaldırıldı",
        });
      } catch (error) {
        toast.error("Ürün kaldırma hatası", {
          description: error instanceof Error ? error.message : "Ürün sepetten kaldırılamadı",
        });
        throw error;
      }
    } else {
      setAndPersistCart((prev) => prev.filter((item) => item.product?.id !== productId));
      toast.info("Sepetten kaldırıldı", {
        description: "Ürün sepetinizden kaldırıldı",
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    const token = getToken();

    if (token) {
      try {
        await apiUpdateCartItem(productId, { quantity });
        await refreshCart();
      } catch (error) {
        toast.error("Miktar güncelleme hatası", {
          description: error instanceof Error ? error.message : "Miktar güncellenemedi",
        });
        throw error;
      }
    } else {
      setAndPersistCart((prev) =>
        prev.map((item) =>
          item.product?.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    const token = getToken();

    if (token) {
      try {
        await apiClearCart();
        setCartItems([]);
        saveCartToStorage([]);
        toast.success("Sepet temizlendi", {
          description: "Tüm ürünler sepetinizden kaldırıldı",
        });
      } catch (error) {
        toast.error("Sepet temizleme hatası", {
          description: error instanceof Error ? error.message : "Sepet temizlenemedi",
        });
        throw error;
      }
    } else {
      setCartItems([]);
      saveCartToStorage([]);
      toast.success("Sepet temizlendi", {
        description: "Tüm ürünler sepetinizden kaldırıldı",
      });
    }
  };

  const isInCart = (productId: string) =>
    cartItems.some((item) => item.product?.id === productId);

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product?.price ?? 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        cartTotal,
        cartCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
