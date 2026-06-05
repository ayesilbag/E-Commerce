import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import type { Product } from "@/types";
import { toast } from "@/components/ui/sonner";
import {
  getWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from "@/services/wishlist.service";
import { getToken } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "bizdenalbizdensat_wishlist";

const saveWishlistToStorage = (items: Product[]) => {
  try { localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items)); } catch {}
};

const loadWishlistFromStorage = (): Product[] => {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const convertApiWishlist = (apiWishlist: any): Product[] =>
  (apiWishlist.items || [])
    .filter((item: any) => item?.product)
    .map((item: any) => item.product as Product);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => loadWishlistFromStorage());

  const setAndPersistWishlist = useCallback((items: Product[]) => {
    setWishlistItems(items);
    saveWishlistToStorage(items);
  }, []);

  const refreshWishlist = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const apiWishlist = await getWishlist();
      const items = convertApiWishlist(apiWishlist);
      setAndPersistWishlist(items);
    } catch (error) {
      console.error("Error refreshing wishlist:", error);
    }
  }, [setAndPersistWishlist]);

  // Load wishlist on mount — API for authenticated users, localStorage for guests
  useEffect(() => {
    const loadWishlist = async () => {
      const token = getToken();
      if (token) {
        try {
          const apiWishlist = await getWishlist();
          setAndPersistWishlist(convertApiWishlist(apiWishlist));
        } catch (error) {
          console.error("Error loading wishlist from API:", error);
        }
      }
      // Guest: başlangıç değeri zaten localStorage'dan useState initializer'da yüklendi
    };
    loadWishlist();
  }, []);

  // Login: misafir favorilerini API'ye senkronize et; Logout: localStorage'ı temizle
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const handleAuthChange = async () => {
      if (isAuthenticated) {
        const guestItems = loadWishlistFromStorage();
        if (guestItems.length > 0) {
          await Promise.allSettled(
            guestItems.map((p) => apiAddToWishlist({ productId: p.id }))
          );
        }
        await refreshWishlist();
      } else {
        setAndPersistWishlist([]);
      }
    };
    handleAuthChange();
  }, [isAuthenticated]);

  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item.id === productId);

  const addToWishlist = async (product: Product) => {
    if (isInWishlist(product.id)) {
      toast.info("Zaten favorilerinizde", {
        description: `${product.name} zaten favorilerinizde`,
      });
      return;
    }

    const token = getToken();

    if (token) {
      try {
        await apiAddToWishlist({ productId: product.id });
        await refreshWishlist();
        toast.success("Favorilere eklendi", {
          description: `${product.name} favorilerinize eklendi`,
        });
      } catch (error: any) {
        const errorMessage = error?.message || "Ürün favorilere eklenemedi";
        if (
          errorMessage.includes("zaten favorilerde") ||
          errorMessage.includes("already in wishlist")
        ) {
          await refreshWishlist();
          toast.info("Zaten favorilerinizde", {
            description: `${product.name} zaten favorilerinizde`,
          });
          return;
        }
        toast.error("Favorilere ekleme hatası", { description: errorMessage });
        throw error;
      }
    } else {
      setAndPersistWishlist([...wishlistItems, product]);
      toast.success("Favorilere eklendi", {
        description: `${product.name} favorilerinize eklendi`,
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const token = getToken();

    if (token) {
      try {
        const apiWishlist = await getWishlist();
        const item = apiWishlist.items.find(
          (i: any) => i.productId === productId
        );
        if (item) {
          await apiRemoveFromWishlist(item.id);
        }
        await refreshWishlist();
        toast.info("Favorilerden kaldırıldı", {
          description: "Ürün favorilerinizden kaldırıldı",
        });
      } catch (error) {
        toast.error("Favorilerden kaldırma hatası", {
          description:
            error instanceof Error
              ? error.message
              : "Ürün favorilerden kaldırılamadı",
        });
        throw error;
      }
    } else {
      setAndPersistWishlist(wishlistItems.filter((item) => item.id !== productId));
      toast.info("Favorilerden kaldırıldı", {
        description: "Ürün favorilerinizden kaldırıldı",
      });
    }
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
