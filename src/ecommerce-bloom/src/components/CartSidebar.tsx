import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2, X, LogIn } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { getImageUrl } from "@/lib/product-utils";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

const CartSidebar = ({ open, onClose }: CartSidebarProps) => {
  const { isAuthenticated } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-sm sm:max-w-md flex flex-col p-3 xs:p-4 md:p-6">
        <SheetHeader className="space-y-0.5 pr-6">
          <SheetTitle className="flex items-center gap-2 text-sm">
            <ShoppingBag className="h-4 xs:h-5 md:h-5 w-4 xs:w-5 md:w-5" />
            Sepetim ({cartCount})
          </SheetTitle>
        </SheetHeader>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Kapat</span>
        </SheetClose>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-8 xs:py-10 md:py-12">
            <ShoppingBag className="h-12 xs:h-14 md:h-16 w-12 xs:w-14 md:w-16 text-gray-300 mb-3 xs:mb-4 md:mb-4" />
            <p className="text-sm font-medium text-gray-500 mb-1">Sepetiniz boş</p>
            <p className="text-xs xs:text-sm md:text-sm text-gray-400 text-center mb-4 xs:mb-6 md:mb-6">Henüz sepetinize ürün eklemediniz.</p>
            <SheetClose asChild>
              <Link to="/shop">
                <Button variant="outline" className="text-sm h-9">Alışverişe Devam Et</Button>
              </Link>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 xs:py-6 md:py-6">
              <div className="space-y-3 xs:space-y-4 md:space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product?.id} className="flex gap-2 xs:gap-3 md:gap-4 border-b pb-3 xs:pb-4 md:pb-4">
                    <div className="h-20 xs:h-24 md:h-24 w-20 xs:w-24 md:w-24 flex-shrink-0 rounded-md border overflow-hidden">
                      <img
                        src={getImageUrl(item.product?.image)}
                        alt={item.product?.name || 'Ürün'}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-xs font-medium gap-1">
                          <h3>
                            <Link to={`/product/${item.product?.id}`} onClick={onClose} className="hover:text-purple-default line-clamp-2">
                              {item.product?.name || 'Ürün'}
                            </Link>
                          </h3>
                          <p className="flex-shrink-0">₺{((item.product?.price ?? 0) * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-0.5 xs:mt-1 md:mt-1 text-xs text-gray-500 line-clamp-1">
                          {item.product?.description}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between mt-1 xs:mt-2 md:mt-2">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 xs:h-7 xs:w-7 md:h-7 md:w-7"
                            onClick={() => item.product?.id && updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-2.5 xs:h-3 md:h-3 w-2.5 xs:w-3 md:w-3" />
                          </Button>
                          <span className="mx-1.5 xs:mx-2 md:mx-2 w-6 xs:w-8 md:w-8 text-center text-xs xs:text-sm md:text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 xs:h-7 xs:w-7 md:h-7 md:w-7"
                            onClick={() => item.product?.id && updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-2.5 xs:h-3 md:h-3 w-2.5 xs:w-3 md:w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => item.product?.id && removeFromCart(item.product.id)}
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

            <SheetFooter className="border-t pt-3 xs:pt-4 md:pt-4">
              <div className="w-full space-y-2 xs:space-y-3 md:space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <p>Ara Toplam</p>
                  <p>₺{cartTotal.toFixed(2)}</p>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Kargo ve vergiler ödeme sırasında hesaplanır.
                </p>
                <div className="pt-2 xs:pt-3 md:pt-3">
                  {isAuthenticated ? (
                    <SheetClose asChild>
                      <Link to="/order">
                        <Button className="w-full bg-purple-gradient h-9 text-sm">
                          Ödemeye Geç
                        </Button>
                      </Link>
                    </SheetClose>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-center text-gray-500">
                        Ödemeye geçmek için giriş yapmanız gerekiyor
                      </p>
                      <SheetClose asChild>
                        <Link to="/login" state={{ from: "/order" }}>
                          <Button className="w-full bg-purple-gradient h-9 text-sm gap-2">
                            <LogIn size={14} />
                            Giriş Yap ve Devam Et
                          </Button>
                        </Link>
                      </SheetClose>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <SheetClose asChild>
                    <Link to="/shop" className="text-xs xs:text-sm md:text-sm font-medium text-purple-default hover:text-purple-dark">
                      Alışverişe Devam Et
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;