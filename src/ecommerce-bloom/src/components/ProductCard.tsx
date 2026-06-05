import { useState } from "react";
import type { Product } from "@/types";
import { getImageUrl } from "@/lib/product-utils";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addToCart(product);
      toast.success("Sepete eklendi", { description: product.name, duration: 2000 });
    } catch {
      toast.error("Sepete eklenemedi");
    } finally {
      setIsAdding(false);
    }
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

      {/* Favori butonu — her zaman görünür */}
      <button
        className={`absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full shadow-sm border transition-colors
          ${isInWishlist(product.id)
            ? "bg-white text-red-500 border-red-200"
            : "bg-white/80 text-gray-400 border-gray-200 hover:text-red-400"}`}
        onClick={handleWishlist}
        aria-label="Favorilere ekle"
      >
        <Heart size={13} className={isInWishlist(product.id) ? "fill-red-500" : ""} />
      </button>

      {/* Product image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Sepete Ekle — masaüstünde hover'da, mobilde her zaman görünür */}
        <div className="absolute bottom-0 left-0 right-0 p-1.5 md:p-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 md:flex hidden">
          <Button
            className="btn-gradient flex-1 text-xs"
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? <Loader2 size={12} className="mr-1 animate-spin" /> : <ShoppingBag className="mr-1" size={12} />}
            {isAdding ? "Ekleniyor..." : "Sepete Ekle"}
          </Button>
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

        <div className="flex items-baseline mt-2">
          <span className="font-semibold text-sm">₺{product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="ml-1 text-xs text-gray-400 line-through">
              ₺{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Mobilde her zaman görünen sepet butonu */}
        <Button
          className="btn-gradient w-full text-xs mt-2 h-8 md:hidden"
          size="sm"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? <Loader2 size={12} className="mr-1 animate-spin" /> : <ShoppingBag size={12} className="mr-1" />}
          {isAdding ? "Ekleniyor..." : "Sepete Ekle"}
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;