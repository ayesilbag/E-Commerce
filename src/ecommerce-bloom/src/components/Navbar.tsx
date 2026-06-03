
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
  SheetClose
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { getImageUrl } from "@/lib/product-utils";
import { getCategories } from "@/services/categories.service";
import type { Category } from "@/types";
import CartSidebar from "./CartSidebar";
import WishlistSidebar from "./WishlistSidebar";

const Navbar = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [categories, setCategories] = useState<Category[]>([]);
  const settings = useSiteSettings();
  const siteName = settings.siteName;
  const logoUrl = settings.logoUrl ? getImageUrl(settings.logoUrl) : null;

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.filter((c) => c.isActive)))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Sayfa yukarı kaydırılıyorsa navbar'ı göster
      if (currentScrollY < lastScrollY) {
        setIsHidden(false);
      }
      // Sayfa aşağı kaydırılıyorsa ve belirli bir mesafeden sonraysa navbar'ı gizle
      else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsHidden(true);
      }

      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white border-b border-gray-200 transition-transform duration-300 ease-in-out ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      } ${isScrolled ? 'shadow-sm' : ''}`}
    >
      <div className="container-custom px-2 xs:px-4 sm:px-6">
        {/* Top Section */}
        <div className="flex items-center justify-between h-14 xs:h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            {logoUrl ? (
              <>
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-9 w-9 object-contain md:hidden"
                />
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="hidden md:block h-14 w-auto max-h-14"
                />
              </>
            ) : (
              <>
                <img
                  src="/bizden-logo-mobile.png"
                  alt={siteName}
                  className="h-9 w-9 object-contain md:hidden"
                />
                <img
                  src="/bizden-logo.png"
                  alt={siteName}
                  className="hidden md:block h-14 w-auto max-h-14"
                />
              </>
            )}
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2 md:mx-4 lg:mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Ürün, kategori veya marka ara"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full h-9 md:h-10 pr-10 md:pr-12 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-800 cursor-pointer"
              >
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* User Account Button */}
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-1.5 md:gap-2 border-purple-default bg-white text-purple-default hover:bg-purple-gradient hover:border-transparent hover:text-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg h-auto transition-all duration-300 ease-in-out text-xs md:text-sm"
              onClick={() => navigate(isAuthenticated ? '/account' : '/login')}
            >
              <User size={14} />
              <span className="font-medium hidden md:inline">
                {isAuthenticated ? 'Hesabım' : 'Giriş Yap'}
              </span>
            </Button>

            {/* Wishlist Button */}
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-1.5 md:gap-2 border-purple-default bg-white text-purple-default hover:bg-purple-gradient hover:border-transparent hover:text-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg h-auto transition-all duration-300 ease-in-out text-xs md:text-sm"
              onClick={() => setIsWishlistOpen(true)}
            >
              <Heart size={14} />
              <span className="font-medium hidden lg:inline">Favorilerim</span>
              {wishlistCount > 0 && (
                <span className="ml-1 bg-purple-gradient text-white text-xs md:text-sm rounded-full w-4 h-4 md:w-6 md:h-6 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Button>

            {/* Cart Button */}
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-1.5 md:gap-2 border-purple-default bg-white text-purple-default hover:bg-purple-gradient hover:border-transparent hover:text-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg h-auto relative transition-all duration-300 ease-in-out text-xs md:text-sm"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={14} />
              <span className="font-medium hidden lg:inline">Sepetim</span>
              {cartCount > 0 && (
                <span className="ml-1 bg-purple-gradient text-white text-xs md:text-sm rounded-full w-4 h-4 md:w-6 md:h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button - Using Sheet component */}
            {isMobile && (
              <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 xs:h-10 xs:w-10">
                    <Menu size={18} />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-purple-dark border-none p-0 rounded-l-xl w-[280px] sm:w-[320px] max-h-screen overflow-y-auto" side="right">
                  <MobileNavigation
                    onClose={() => setIsDrawerOpen(false)}
                    onOpenCart={() => {
                      setIsDrawerOpen(false);
                      setIsCartOpen(true);
                    }}
                    onOpenWishlist={() => {
                      setIsDrawerOpen(false);
                      setIsWishlistOpen(true);
                    }}
                    cartCount={cartCount}
                    wishlistCount={wishlistCount}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    siteName={siteName}
                    logoUrl={logoUrl}
                  />
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {/* Bottom Section - Categories */}
        <div className="hidden md:flex items-center gap-3 md:gap-6 lg:gap-8 py-1.5 md:py-2 lg:py-3 border-t border-gray-100">
          {/* Categories Dropdown */}
          <div
            className="relative group"
          >
            <button className="flex items-center gap-1 text-xs md:text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors">
              <span>Kategoriler</span>
              <ChevronRight size={12} className="rotate-90" />
            </button>

            {/* Categories Dropdown Menu */}
            <div className="absolute top-full left-0 mt-1 md:mt-2 w-48 md:w-60 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 md:py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="max-h-48 md:max-h-64 lg:max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${encodeURIComponent(category.slug)}`}
                    className="flex items-center justify-between px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-50 text-xs md:text-sm text-gray-700 hover:text-purple-700 transition-colors"
                  >
                    <span>{category.name}</span>
                    <ChevronRight size={10} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <Link to="/shop" className="text-xs md:text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors">
            Mağaza
          </Link>
          <Link to="/about" className="text-xs md:text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors">
            Hakkımızda
          </Link>
          <Link to="/contact" className="text-xs md:text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors">
            İletişim
          </Link>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Wishlist Sidebar */}
      <WishlistSidebar
        open={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </header>
  );
};

const MobileNavigation = ({
  onClose,
  onOpenCart,
  onOpenWishlist,
  cartCount,
  wishlistCount,
  isAuthenticated,
  user,
  siteName,
  logoUrl,
}: {
  onClose: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  cartCount: number;
  wishlistCount: number;
  isAuthenticated: boolean;
  user: any;
  siteName: string;
  logoUrl: string | null;
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    onClose();
  };

  return (
    <div className="flex flex-col h-full p-4 xs:p-6 text-white overflow-y-auto bg-purple-dark">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 xs:mb-8">
        <button onClick={onClose} className="flex items-center gap-2 min-w-0">
          <img
            src={logoUrl ?? "/bizden-logo-mobile.png"}
            alt={siteName}
            className="h-10 w-10 object-contain shrink-0"
          />
          <span className="font-semibold text-sm text-white truncate">{siteName}</span>
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <X size={20} />
        </Button>
      </div>

      {/* Mobile Search */}
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full h-10 pr-10 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1">
        {/* Navigation Links */}
        <nav className="mb-8">
          <h3 className="text-white/60 text-xs xs:text-sm font-semibold mb-3 uppercase tracking-wider px-2">Mağaza</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleNavigate("/shop")}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm text-white hover:bg-white/10 transition-colors font-medium"
            >
              Tüm Ürünler
            </button>
            <button
              onClick={() => handleNavigate("/about")}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm text-white hover:bg-white/10 transition-colors font-medium"
            >
              Hakkımızda
            </button>
            <button
              onClick={() => handleNavigate("/contact")}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm text-white hover:bg-white/10 transition-colors font-medium"
            >
              İletişim
            </button>
          </div>
        </nav>

        {/* Account Section */}
        <div className="space-y-2">
          <h3 className="text-white/60 text-xs xs:text-sm font-semibold mb-3 uppercase tracking-wider px-2">Hesabım</h3>

          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 text-white/80 text-sm">
                Merhaba, {user?.fullName?.split(' ')[0] || 'Kullanıcı'}
              </div>
              <button
                onClick={() => handleNavigate("/account")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white bg-white/5 hover:bg-white/15 transition-colors border border-white/10 font-medium"
              >
                <User size={18} />
                <span>Hesabım</span>
              </button>
              <button
                onClick={() => handleNavigate("/wishlist")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white bg-white/5 hover:bg-white/15 transition-colors border border-white/10 font-medium"
              >
                <Heart size={18} />
                <span className="flex-1 text-left">Favorilerim</span>
                {wishlistCount > 0 && (
                  <span className="bg-purple-gradient text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-red-400 bg-white/5 hover:bg-red-500/20 transition-colors border border-red-500/30 font-medium"
              >
                <LogOut size={18} />
                <span>Çıkış Yap</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigate("/login")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white bg-white/5 hover:bg-white/15 transition-colors border border-white/10 font-medium"
              >
                <User size={18} />
                <span>Giriş Yap</span>
              </button>
              <button
                onClick={() => handleNavigate("/register")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white bg-white/5 hover:bg-white/15 transition-colors border border-white/10 font-medium"
              >
                <User size={18} />
                <span>Kayıt Ol</span>
              </button>
            </>
          )}

          <button
            onClick={onOpenWishlist}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm xs:text-base text-white bg-white/5 hover:bg-white/15 transition-colors border border-white/10 font-medium"
          >
            <Heart size={18} />
            <span className="flex-1 text-left">Favorilerim</span>
            {wishlistCount > 0 && (
              <span className="bg-purple-gradient text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenCart}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white bg-purple-gradient hover:bg-purple-700 transition-colors border border-purple-500 font-medium mt-4"
          >
            <ShoppingBag size={18} />
            <span className="flex-1 text-left">Sepetim</span>
            {cartCount > 0 && (
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


export default Navbar;