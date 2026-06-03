import { useState } from "react";
import type { Product } from "@/types";
import { getImageUrl } from "@/lib/product-utils";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const getProductImageUrl = (path: string | undefined) => getImageUrl(path);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product badge */}
      {product.badge && (
        <div className={`
          absolute top-2 md:top-4 left-2 md:left-4 z-10 px-1.5 xs:px-2 py-0.5 md:py-1 rounded text-xs font-medium text-white
          ${product.badge === 'Sale' ? 'bg-red-500' : 'bg-purple-gradient'}
        `}>
          {product.badge === 'Sale' ? 'İndirim' : 'Yeni'}
        </div>
      )}

      {/* Product image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick actions */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 p-1.5 md:p-2 lg:p-4 transition-all duration-300 transform
            ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
          `}
        >
          <div className="flex gap-1 md:gap-2">
            <Button
              className="btn-gradient flex-1 text-xs md:text-sm"
              size="sm"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-1" size={12} />
              <span className="hidden sm:inline">Sepete Ekle</span>
              <span className="sm:hidden">Sepet</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`h-7 w-7 md:h-8 md:w-8 ${isInWishlist(product.id)
                ? "bg-white/90 text-red-500 border-red-200"
                : "bg-white/90"}`}
              onClick={handleWishlist}
            >
              <Heart
                size={10}
                className={isInWishlist(product.id) ? "fill-red-500" : ""}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="p-2.5 xs:p-3 md:p-4 flex flex-col flex-1">
        <div className="flex items-center mb-1 md:mb-2">
          <div className="flex items-center">
            {Array(5).fill(0).map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
        </div>

        <h3 className="font-medium text-purple-dark text-sm line-clamp-1 mb-1">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-baseline mt-2 md:mt-3">
          <span className="font-semibold text-sm">₺{product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="ml-1 md:ml-2 text-xs text-gray-400 line-through">
              ₺{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;