import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";

const Wishlist = () => {
  const wishlist = useAppPagesUi()?.wishlist;
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const pageTitle = uiLabel(wishlist?.pageTitle);
  const pageProductUnit = uiLabel(wishlist?.pageProductUnit);

  const handleAddAllToCart = async () => {
    try {
      for (const product of wishlistItems) {
        await addToCart(product);
      }
      if (uiLabel(wishlist?.addAllSuccessToast)) {
        toast.success(wishlist!.addAllSuccessToast!);
      }
    } catch (error) {
      if (uiLabel(wishlist?.addAllErrorToast)) {
        toast.error(wishlist!.addAllErrorToast!);
      }
    }
  };

  const handleRemoveFromWishlist = async (productId: string, productName: string) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error("Favorilerden kaldırırken hata:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-custom px-4 py-8 md:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              {pageTitle && (
                <h1 className="text-base font-semibold mb-2">{pageTitle}</h1>
              )}
              {pageProductUnit && wishlistItems.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {wishlistItems.length} {pageProductUnit}
                </p>
              )}
            </div>
            {wishlistItems.length > 0 && (
              <div className="flex gap-2">
                {uiLabel(wishlist?.pageContinueShopping) && (
                <Link to="/shop">
                  <Button variant="outline">
                    {wishlist!.pageContinueShopping}
                  </Button>
                </Link>
                )}
                {uiLabel(wishlist?.pageAddAllToCart) && (
                <Button className="btn-gradient" onClick={handleAddAllToCart}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {wishlist!.pageAddAllToCart}
                </Button>
                )}
              </div>
            )}
          </div>

          {wishlistItems.length === 0 && (
            <div className="text-center py-16 md:py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 mb-4">
                <Heart className="h-10 w-10 md:h-12 md:w-12 text-primary" />
              </div>
              {uiLabel(wishlist?.pageEmptyTitle) && (
                <h2 className="text-sm font-semibold mb-2">{wishlist!.pageEmptyTitle}</h2>
              )}
              {uiLabel(wishlist?.pageEmptyDescription) && (
                <p className="text-xs text-muted-foreground mb-6">{wishlist!.pageEmptyDescription}</p>
              )}
              {uiLabel(wishlist?.pageStartShopping) && (
              <Link to="/shop">
                <Button className="btn-gradient">{wishlist!.pageStartShopping}</Button>
              </Link>
              )}
            </div>
          )}

          {wishlistItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {wishlistItems.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 z-10 bg-card/90 hover:bg-red-500/10 hover:text-red-500 hover:border-red-200"
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
