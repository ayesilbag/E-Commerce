import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProduct, getProductReviews, getProducts } from "@/services/products.service";
import { getImageUrl } from "@/lib/product-utils";
import type { Product, Review } from "@/types";
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  Star,
  Truck,
  Package,
  CreditCard,
  Package2,
  Shield
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // API State Management
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI State management
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  usePageTitle(product?.name);

  // Fetch product detail and reviews
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError("Ürün ID bulunamadı");
          return;
        }

        // Fetch product detail
        const productData = await getProduct(id);
        // Fix images array if empty but image field exists
        if (productData && !productData.images?.length && productData.image) {
          productData.images = [productData.image];
        }
        setProduct(productData);

        // Varyantlardan varsayılan beden/renk seç
        if (productData.variants?.length) {
          const firstVariant = productData.variants[0];
          if (firstVariant.size) setSelectedSize(firstVariant.size);
          if (firstVariant.color) setSelectedColor(firstVariant.color);
        }

        // Fetch product reviews
        const reviewsData = await getProductReviews(id, { page: 1, limit: 10 });
        setReviews(reviewsData.items);

        // Fetch similar products (same category)
        const similarData = await getProducts({ 
          category: productData.category,
          limit: 4,
          page: 1
        });
        setSimilarProducts(similarData.items.filter((p: Product) => p.id !== id).slice(0, 4));

      } catch (err) {
        setError(err instanceof Error ? err.message : "Ürün yüklenirken hata oluştu");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Check if product is in wishlist when product changes
  useEffect(() => {
    if (product) {
      setIsFavorite(isInWishlist(product.id));
    }
  }, [product?.id, isInWishlist]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-default mb-4"></div>
            <p className="text-gray-600">Ürün yükleniyor...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Ürün bulunamadı"}</p>
            <Link to="/shop">
              <Button className="btn-gradient">Mağazaya Geri Dön</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // API'den gelen specifications; boşsa temel bilgileri göster
  const specifications = product.specifications?.length
    ? product.specifications
    : [
        { name: "Kategori", value: product.category },
        { name: "Stok", value: `${product.stock ?? 0} adet` },
      ];

  // Varyantlardan benzersiz beden ve renk listeleri
  const availableSizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean) as string[])];
  const availableColors = [...new Set(product.variants?.map(v => v.color).filter(Boolean) as string[])];

  // Seçili varyantın stoğu
  const selectedVariant = product.variants?.find(
    v => (!selectedSize || v.size === selectedSize) && (!selectedColor || v.color === selectedColor)
  );
  const effectiveStock = selectedVariant?.stock ?? product.stock ?? 0;

  const incrementQuantity = () => {
    if (effectiveStock > 0 && quantity < effectiveStock) setQuantity(q => q + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  // Sepete ekle — seçili varyant bilgisini de ilet
  const handleAddToCart = () => {
    if (effectiveStock <= 0) {
      toast.error("Stok yetersiz", { description: "Bu ürün şu an stokta bulunmuyor." });
      return;
    }
    addToCart({ ...product, selectedSize, selectedColor } as any, quantity);
    toast.success("Sepete eklendi", {
      description: `${quantity} x ${product.name} sepetinize eklendi`,
    });
  };

  // Favori toggle
  const handleAddToWishlist = () => {
    if (isFavorite) {
      removeFromWishlist(product.id);
      setIsFavorite(false);
    } else {
      addToWishlist(product);
      setIsFavorite(true);
    }
  };

  // Paylaş
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: window.location.href });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link kopyalandı!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white pt-4 xs:pt-6 sm:pt-8 pb-2 xs:pb-3 sm:pb-4 border-b">
          <div className="container-custom px-2 xs:px-4 sm:px-6">
            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-xs overflow-x-auto pb-1">
              <Link to="/" className="text-gray-500 hover:text-purple-default transition-colors whitespace-nowrap">Anasayfa</Link>
              <ChevronRight size={12} className="xs:size-[14px] md:size-[16px] text-gray-300 flex-shrink-0" />
              <Link to="/shop" className="text-gray-500 hover:text-purple-default transition-colors whitespace-nowrap">Mağaza</Link>
              <ChevronRight size={12} className="xs:size-[14px] md:size-[16px] text-gray-300 flex-shrink-0" />
              <Link to={`/category/${product.category.toLowerCase()}`} className="text-gray-500 hover:text-purple-default transition-colors whitespace-nowrap">{product.category}</Link>
              <ChevronRight size={12} className="xs:size-[14px] md:size-[16px] text-gray-300 flex-shrink-0" />
              <span className="text-gray-600 font-medium line-clamp-1">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-4 xs:py-6 sm:py-8 md:py-12">
          <div className="container-custom px-2 xs:px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xs:gap-6 sm:gap-6 md:gap-10">
              {/* Product Images */}
              <div className="md:col-span-1 space-y-2 xs:space-y-3 sm:space-y-3 md:space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-xl border border-gray-100 bg-gray-50 relative">
                  <img
                    src={getImageUrl(product.images[selectedImage])}
                    alt={`${product.name} - görüntü ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <div className="absolute top-2 xs:top-2 sm:top-3 md:top-4 left-2 xs:left-2 sm:left-3 md:left-4 bg-red-500 text-white px-1.5 xs:px-2 sm:px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-medium">
                      {product.badge === 'Sale' ? 'İndirim' : 'Yeni'}
                    </div>
                  )}
                  <div className="absolute top-2 xs:top-2 sm:top-3 md:top-4 right-2 xs:right-2 sm:right-3 md:right-4 bg-white rounded-full p-1 xs:p-1 sm:p-1.5 md:p-2 shadow-md">
                    <Package className="w-2.5 h-2.5 xs:w-3 xs:h-3 md:w-4 md:h-4 text-green-600" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1 xs:gap-1.5 sm:gap-2 md:gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`aspect-square cursor-pointer border rounded-md overflow-hidden transition-all text-xs xs:text-sm ${
                        selectedImage === index ? 'ring-2 ring-purple-default' : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} görüntü ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="md:col-span-2">
                <div className="mb-2 xs:mb-3 sm:mb-4 md:mb-4">
                  <span className="inline-block px-1.5 xs:px-2 sm:px-2 md:px-3 py-0.5 xs:py-0.5 md:py-1 bg-purple-100 text-purple-default text-xs font-medium rounded">
                    {product.category}
                  </span>
                </div>

                <h1 className="text-sm md:text-base font-semibold text-purple-dark mb-2 xs:mb-3 sm:mb-4 md:mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center gap-2 xs:gap-2 sm:gap-3 md:gap-4 mb-3 xs:mb-4 sm:mb-6 pb-3 xs:pb-4 sm:pb-6 border-b">
                  <div className="flex items-center gap-0.5 xs:gap-1">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className="xs:size-[14px] md:size-[16px]"
                        style={{
                          fill: i < Math.round(product.rating) ? '#FBBF24' : 'none',
                          color: i < Math.round(product.rating) ? '#FBBF24' : '#D1D5DB'
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{product.rating} · {reviews.length} Değerlendirme</span>
                </div>

                {/* Price Section */}
                <div className="mb-3 xs:mb-4 sm:mb-6 md:mb-6">
                  <div className="flex items-baseline gap-1 xs:gap-2 md:gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-purple-dark">₺{product.price.toFixed(0)}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xs text-gray-400 line-through">
                          ₺{product.originalPrice.toFixed(0)}
                        </span>
                        <span className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 xs:px-2 md:px-2 md:py-1 rounded font-medium">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% İndirim
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Color Selection — sadece API'de renk varyantı varsa göster */}
                {availableColors.length > 0 && (
                  <div className="mb-3 xs:mb-4 sm:mb-6 md:mb-6 pb-3 xs:pb-4 sm:pb-6 border-b">
                    <p className="font-medium text-gray-900 mb-1.5 xs:mb-2 sm:mb-3 md:mb-3 text-xs">
                      Renk: <span className="text-purple-default">{selectedColor || "Seçiniz"}</span>
                    </p>
                    <div className="flex gap-1.5 xs:gap-2 sm:gap-3 md:gap-3 flex-wrap">
                      {availableColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          title={color}
                          className={`px-2 py-1 border rounded text-xs font-medium transition-all ${
                            selectedColor === color
                              ? 'bg-purple-default text-white border-purple-default'
                              : 'border-gray-300 text-gray-700 hover:border-purple-light'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection — sadece API'de beden varyantı varsa göster */}
                {availableSizes.length > 0 && (
                  <div className="mb-4 xs:mb-4 sm:mb-6 md:mb-6">
                    <p className="font-medium text-gray-900 mb-1.5 xs:mb-2 sm:mb-3 md:mb-3 text-xs">
                      Beden: <span className="text-purple-default">{selectedSize || "Seçiniz"}</span>
                    </p>
                    <div className="flex gap-1 xs:gap-1.5 sm:gap-2 md:gap-2 flex-wrap">
                      {availableSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-2 xs:px-3 sm:px-4 md:px-4 py-1 xs:py-1.5 md:py-2 border rounded font-medium transition-all text-xs ${
                            selectedSize === size
                              ? 'bg-purple-default text-white border-purple-default'
                              : 'border-gray-300 text-gray-700 hover:border-purple-light'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-4 xs:mb-4 sm:mb-6 md:mb-6">
                  <p className="font-medium text-gray-900 mb-1.5 xs:mb-2 sm:mb-3 md:mb-3 text-xs">Adet</p>
                  <div className="flex items-center border rounded-lg w-fit">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="h-7 w-7 xs:h-8 xs:w-8 md:h-10 md:w-10"
                    >
                      <Minus size={12} className="xs:size-[14px] md:size-[16px]" />
                    </Button>
                    <span className="w-8 xs:w-10 md:w-12 text-center font-medium text-xs">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={incrementQuantity}
                      className="h-7 w-7 xs:h-8 xs:w-8 md:h-10 md:w-10"
                    >
                      <Plus size={12} className="xs:size-[14px] md:size-[16px]" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col xs:flex-col sm:flex-row gap-1.5 xs:gap-2 sm:gap-2 md:gap-3 mb-4 xs:mb-4 sm:mb-6 md:mb-6">
                  <Button
                    className="btn-gradient flex-1 gap-1 xs:gap-2 md:gap-2 h-9 text-xs"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag size={14} className="xs:size-[16px] md:size-[20px]" />
                    <span>Sepete Ekle</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={`h-9 gap-1 xs:gap-1.5 md:gap-2 border-purple-light hover:bg-purple-light/10 text-xs whitespace-nowrap ${isFavorite ? "border-red-500 text-red-500 hover:text-red-600" : ""}`}
                    onClick={handleAddToWishlist}
                  >
                    <Heart size={14} className={`xs:size-[16px] md:size-[20px] ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                    <span className="hidden sm:inline">{isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 border-purple-light hover:bg-purple-light/10 text-xs"
                    onClick={handleShare}
                    title="Paylaş"
                  >
                    <Share2 size={14} className="xs:size-[16px] md:size-[20px]" />
                  </Button>
                </div>

                {/* Key Info Boxes */}
                <div className="space-y-1.5 xs:space-y-2 sm:space-y-2 md:space-y-3 mb-4 xs:mb-4 sm:mb-6 md:mb-6">
                  <div className={`flex items-start gap-1.5 xs:gap-2 md:gap-3 p-2 xs:p-2.5 sm:p-3 md:p-4 rounded-lg border ${
                    effectiveStock > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <Check className={`mt-0 xs:mt-0 md:mt-0.5 flex-shrink-0 xs:size-[16px] md:size-[20px] ${effectiveStock > 0 ? 'text-green-600' : 'text-red-500'}`} size={14} />
                    <div className="min-w-0">
                      <p className={`font-medium text-xs ${effectiveStock > 0 ? 'text-green-900' : 'text-red-700'}`}>
                        {effectiveStock > 0 ? 'Stokta Var' : 'Stok Tükendi'}
                      </p>
                      {effectiveStock > 0 && (
                        <p className="text-xs text-green-700">{effectiveStock} adet mevcut</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 xs:gap-2 md:gap-3 p-2 xs:p-2.5 sm:p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Truck className="text-blue-600 mt-0 xs:mt-0 md:mt-0.5 flex-shrink-0 xs:size-[16px] md:size-[20px]" size={14} />
                    <div className="min-w-0">
                      <p className="font-medium text-blue-900 text-xs">Hızlı Teslimat</p>
                      <p className="text-xs text-blue-700">Siparişiniz aynı gün kargoya verilir</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 xs:gap-2 md:gap-3 p-2 xs:p-2.5 sm:p-3 md:p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <CreditCard className="text-purple-default mt-0 xs:mt-0 md:mt-0.5 flex-shrink-0 xs:size-[16px] md:size-[20px]" size={14} />
                    <div className="min-w-0">
                      <p className="font-medium text-purple-dark text-xs">Ödeme Seçenekleri</p>
                      <p className="text-xs text-purple-700">12 aya varan taksit imkanı</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 xs:gap-2 md:gap-3 p-2 xs:p-2.5 sm:p-3 md:p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Shield className="text-orange-600 mt-0 xs:mt-0 md:mt-0.5 flex-shrink-0 xs:size-[16px] md:size-[20px]" size={14} />
                    <div className="min-w-0">
                      <p className="font-medium text-orange-900 text-xs">Garanti ve İade</p>
                      <p className="text-xs text-orange-700">2 yıl üretici garantisi</p>
                    </div>
                  </div>
                </div>

                {/* Kampanya - sadece tags varsa göster */}
                {product.tags?.length > 0 && (
                  <div className="bg-gray-50 p-2 xs:p-2.5 sm:p-3 md:p-4 rounded-lg">
                    <h3 className="font-bold text-xs md:text-sm mb-1.5 xs:mb-2 md:mb-3 text-gray-900">Ürün Etiketleri</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {product.tags.map(tag => (
                        <span key={tag} className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Product Tabs */}
        <section className="py-4 xs:py-6 sm:py-8 md:py-8 bg-white border-t border-b">
          <div className="container-custom px-2 xs:px-4 sm:px-6">
            <Tabs defaultValue="description">
              <TabsList className="grid grid-cols-3 mb-4 xs:mb-6 sm:mb-8 md:mb-8 text-xs">
                <TabsTrigger value="description">Açıklama</TabsTrigger>
                <TabsTrigger value="specifications">Teknik Özellikler</TabsTrigger>
                <TabsTrigger value="reviews">Yorumlar ({reviews.length})</TabsTrigger>
              </TabsList>

              {/* Description Tab */}
              <TabsContent value="description" className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide">Ürün Açıklaması</h2>
                {product.description ? (
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 italic">Bu ürün için henüz açıklama eklenmemiş.</p>
                )}
                {product.longDescription && (
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.longDescription}
                  </p>
                )}
              </TabsContent>

              {/* Specifications Tab */}
              <TabsContent value="specifications">
                <h2 className="text-sm font-semibold uppercase tracking-wide mb-4">Teknik Özellikler</h2>
                {specifications.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="w-full text-xs">
                      <tbody>
                        {specifications.map((spec, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="py-3 px-4 font-medium text-gray-900 w-1/3">{spec.name}</td>
                            <td className="py-3 px-4 text-gray-700">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">Bu ürün için henüz teknik özellik eklenmemiş.</p>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  <div className="md:w-1/3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide mb-3 md:mb-4">Müşteri Yorumları</h2>

                    <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <span className="text-base font-semibold">{product.rating.toFixed(1)}</span>
                        <div>
                          <div className="flex">
                            {Array(5).fill(0).map((_, i) => (
                              <Star
                                key={i}
                                size={18}
                                className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <p className="text-xs md:text-sm text-gray-500">{reviews.length} yoruma dayanarak</p>
                        </div>
                      </div>

                      {/* Rating breakdown */}
                      <div className="space-y-1.5 md:space-y-2">
                        {[5, 4, 3, 2, 1].map(star => {
                          const count = reviews.filter(r => Math.round(r.rating) === star).length;
                          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                          return (
                            <div key={star} className="flex items-center">
                              <span className="text-xs md:text-sm w-6">{star}</span>
                              <Star size={14} className="fill-yellow-400 text-yellow-400 mr-2" />
                              <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                                <div
                                  className="bg-yellow-400 h-1.5 md:h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs md:text-sm text-gray-500 ml-2 w-6 md:w-8">{count}</span>
                            </div>
                          );
                        })}
                      </div>

                      <Button className="btn-gradient w-full mt-4 md:mt-6 text-sm">
                        Yorum Yaz
                      </Button>
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <div className="space-y-4 md:space-y-6">
                      {reviews.map(review => (
                        <div key={review.id} className="border-b pb-4 md:pb-6 last:border-b-0">
                          <div className="flex items-start gap-3 md:gap-4">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userName}`}
                              alt={review.userName}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{review.userName}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {Array(5).fill(0).map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs md:text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString('tr-TR', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>
                              <p className="mt-1.5 md:mt-2 text-xs text-gray-600">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Similar Products Section */}
        <section className="py-8 md:py-16">
          <div className="container-custom px-4">
            <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4 mb-6 md:mb-10">
              <h2 className="text-sm font-semibold uppercase tracking-wide">Benzer Ürünler</h2>
              <Link to="/shop" className="flex items-center text-xs text-purple-default font-medium hover:underline">
                Tümünü Gör <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;