import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, refreshWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Add all items to cart
  const handleAddAllToCart = async () => {
    try {
      for (const product of wishlistItems) {
        await addToCart(product);
      }
      toast.success("Tüm ürünler sepete eklendi");
    } catch (error) {
      toast.error("Ürünler sepete eklenirken hata oluştu");
    }
  };

  // Remove from wishlist
  const handleRemoveFromWishlist = async (productId: string, productName: string) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error("Favorilerden kaldırırken hata:", error);
    }
  };

  // Add single item to cart
  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product);
    } catch (error) {
      console.error("Sepete eklerken hata:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-custom px-4 py-8 md:py-16">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-base font-semibold mb-2">Favorilerim</h1>
              <p className="text-xs text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'ürün' : 'ürün'}
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <div className="flex gap-2">
                <Link to="/shop">
                  <Button variant="outline">
                    Alışverişe Devam Et
                  </Button>
                </Link>
                <Button className="btn-gradient" onClick={handleAddAllToCart}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Tümünü Sepete Ekle
                </Button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {wishlistItems.length === 0 && (
            <div className="text-center py-16 md:py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-purple-50 mb-4">
                <Heart className="h-10 w-10 md:h-12 md:w-12 text-purple-default" />
              </div>
              <h2 className="text-sm font-semibold mb-2">Favorileriniz boş</h2>
              <p className="text-xs text-gray-600 mb-6">Beğendiğiniz ürünleri favorilere ekleyin, daha sonra inceleyin.</p>
              <Link to="/shop">
                <Button className="btn-gradient">Alışverişe Başla</Button>
              </Link>
            </div>
          )}

          {/* Wishlist Items */}
          {wishlistItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {wishlistItems.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                    onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;