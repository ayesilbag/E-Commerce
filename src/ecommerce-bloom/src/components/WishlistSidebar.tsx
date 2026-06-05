import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";

interface WishlistSidebarProps {
  open: boolean;
  onClose: () => void;
}

const WishlistSidebar = ({ open, onClose }: WishlistSidebarProps) => {
  const { wishlistItems, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const wishlist = useAppPagesUi()?.wishlist;
  const global = useAppPagesUi()?.global;
  const closeLabel = uiLabel(global?.closeLabel);
  const productFallback = uiLabel(global?.productFallbackName);
  const titlePrefix = uiLabel(wishlist?.sidebarTitlePrefix);

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-sm sm:max-w-md flex flex-col p-3 xs:p-4 md:p-6">
        {titlePrefix && (
        <SheetHeader className="space-y-0.5 pr-6">
          <SheetTitle className="flex items-center gap-2 text-sm">
            <Heart className="h-4 xs:h-5 md:h-5 w-4 xs:w-5 md:w-5 fill-red-500 text-red-500" />
            {titlePrefix} ({wishlistCount})
          </SheetTitle>
        </SheetHeader>
        )}
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          {closeLabel && <span className="sr-only">{closeLabel}</span>}
        </SheetClose>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-8 xs:py-10 md:py-12">
            <Heart className="h-12 xs:h-14 md:h-16 w-12 xs:w-14 md:w-16 text-muted-foreground/50 mb-3 xs:mb-4 md:mb-4" />
            {uiLabel(wishlist?.sidebarEmptyTitle) && (
              <p className="text-sm font-medium text-muted-foreground mb-1">{wishlist!.sidebarEmptyTitle}</p>
            )}
            {uiLabel(wishlist?.sidebarEmptyDescription) && (
              <p className="text-xs xs:text-sm md:text-sm text-muted-foreground text-center mb-4 xs:mb-6 md:mb-6">{wishlist!.sidebarEmptyDescription}</p>
            )}
            {uiLabel(wishlist?.sidebarExploreButton) && (
            <SheetClose asChild>
              <Link to="/shop">
                <Button variant="outline" className="text-sm h-9">{wishlist!.sidebarExploreButton}</Button>
              </Link>
            </SheetClose>
            )}
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 xs:py-6 md:py-6">
              <div className="space-y-3 xs:space-y-4 md:space-y-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex gap-2 xs:gap-3 md:gap-4 border-b pb-3 xs:pb-4 md:pb-4">
                    <div className="h-20 xs:h-24 md:h-24 w-20 xs:w-24 md:w-24 flex-shrink-0 rounded-md border overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name || productFallback || ''}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-xs font-medium gap-1">
                          <h3>
                            <Link to={`/product/${item.id}`} onClick={onClose} className="hover:text-primary line-clamp-2">
                              {item.name || productFallback}
                            </Link>
                          </h3>
                          <p className="flex-shrink-0">₺{item.price.toFixed(2)}</p>
                        </div>
                        {item.description && (
                        <p className="mt-0.5 xs:mt-1 md:mt-1 text-xs text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                        )}
                      </div>
                      <div className="flex flex-1 items-end justify-between mt-1 xs:mt-2 md:mt-2">
                        {uiLabel(wishlist?.sidebarAddToCartLabel) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-0.5 xs:gap-1 md:gap-1 text-xs xs:text-xs md:text-sm h-6 xs:h-7 md:h-8 px-2 xs:px-2.5 md:px-3"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingBag className="h-3 xs:h-3 md:h-3.5 w-3 xs:w-3 md:w-3.5" />
                          <span className="hidden xs:inline">{wishlist!.sidebarAddToCartLabel}</span>
                        </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 h-6 w-6 xs:h-7 xs:w-7 md:h-8 md:w-8 p-0"
                        >
                          <Trash2 className="h-3 xs:h-3.5 md:h-4 w-3 xs:w-3.5 md:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {uiLabel(wishlist?.sidebarContinueButton) && (
            <SheetFooter className="border-t pt-3 xs:pt-4 md:pt-4">
              <div className="w-full space-y-3 xs:space-y-4 md:space-y-4">
                <SheetClose asChild>
                  <Button className="w-full bg-primary text-primary-foreground h-9 text-sm">
                    {wishlist!.sidebarContinueButton}
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistSidebar;
