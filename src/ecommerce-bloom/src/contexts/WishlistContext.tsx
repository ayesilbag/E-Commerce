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

const convertApiWishlist = (apiWishlist: any): Product[] =>
  (apiWishlist.items || [])
    .filter((item: any) => item?.product)
    .map((item: any) => item.product as Product);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  const refreshWishlist = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const apiWishlist = await getWishlist();
      setWishlistItems(convertApiWishlist(apiWishlist));
    } catch (error) {
      console.error("Error refreshing wishlist:", error);
    }
  }, []);

  // Load wishlist on mount — API for authenticated users, empty state for guests
  useEffect(() => {
    const loadWishlist = async () => {
      const token = getToken();
      if (token) {
        try {
          const apiWishlist = await getWishlist();
          setWishlistItems(convertApiWishlist(apiWishlist));
        } catch (error) {
          console.error("Error loading wishlist from API:", error);
        }
      }
      // Guest users start with an empty wishlist (no persistence needed)
    };
    loadWishlist();
  }, []);

  // Clear wishlist when user logs out, reload when logs in
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const handleAuthChange = async () => {
      if (isAuthenticated) {
        await refreshWishlist();
      } else if (wishlistItems.length > 0) {
        setWishlistItems([]);
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
      setWishlistItems((prev) => [...prev, product]);
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
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
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
