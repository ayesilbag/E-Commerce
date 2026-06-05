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
  SheetTrigger,
} from "./ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { getImageUrl } from "@/lib/product-utils";
import { getCategories } from "@/services/categories.service";
import type { Category, NavbarUiContent } from "@/types";
import CartSidebar from "./CartSidebar";
import WishlistSidebar from "./WishlistSidebar";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
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
  const nav = settings.storefrontContent?.navbar;
  const siteName = settings.siteName;
  const logoUrl = settings.logoUrl ? getImageUrl(settings.logoUrl) : null;
  const showSearch = Boolean(nav?.searchPlaceholder);
  const showCategories = Boolean(nav?.categoriesLabel) && categories.length > 0;
  const primaryLinks = nav?.primaryLinks ?? [];

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.filter((c) => c.isActive)))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        setIsHidden(false);
      } else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
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

  const accountLabel = isAuthenticated ? nav?.accountLabel : nav?.loginLabel;
  const showBottomNav = showCategories || primaryLinks.length > 0;

  return (
    <header
      className={`sticky top-0 z-40 bg-background border-b border-border transition-transform duration-300 ease-in-out ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      } ${isScrolled ? 'shadow-sm' : ''}`}
    >
      <div className="container-custom px-2 xs:px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 xs:h-16 md:h-20">
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
            ) : siteName ? (
              <span className="font-semibold text-base md:text-lg truncate">{siteName}</span>
            ) : null}
          </Link>

          {showSearch && (
          <div className="hidden md:flex flex-1 max-w-xl mx-2 md:mx-4 lg:mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder={nav!.searchPlaceholder!}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full h-9 md:h-10 pr-10 md:pr-12 text-sm border-primary/30 focus:border-primary focus:ring-primary"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 cursor-pointer"
              >
                <Search size={16} />
              </button>
            </div>
          </div>
          )}

          <div className="flex items-center gap-1 md:gap-2">
            {accountLabel && (
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-1.5 md:gap-2 border-primary text-primary hover:bg-primary hover:border-primary hover:text-primary-foreground px-2 md:px-3 py-1.5 md:py-2 rounded-lg h-auto transition-all duration-300 ease-in-out text-xs md:text-sm"
              onClick={() => navigate(isAuthenticated ? '/account' : '/login')}
            >
              <User size={14} />
              <span className="font-medium hidden md:inline">{accountLabel}</span>
            </Button>
            )}

            {nav?.wishlistLabel && (
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-1.5 md:gap-2 border-primary text-primary hover:bg-primary hover:border-primary hover:text-primary-foreground px-2 md:px-3 py-1.5 md:py-2 rounded-lg h-auto transition-all duration-300 ease-in-out text-xs md:text-sm"
              onClick={() => setIsWishlistOpen(true)}
            >
              <Heart size={14} />
              <span className="font-medium hidden lg:inline">{nav.wishlistLabel}</span>
              {wishlistCount > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs md:text-sm rounded-full w-4 h-4 md:w-6 md:h-6 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Button>
            )}

            {nav?.cartLabel && (
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-1.5 md:gap-2 border-primary text-primary hover:bg-primary hover:border-primary hover:text-primary-foreground px-2 md:px-3 py-1.5 md:py-2 rounded-lg h-auto relative transition-all duration-300 ease-in-out text-xs md:text-sm"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={14} />
              <span className="font-medium hidden lg:inline">{nav.cartLabel}</span>
              {cartCount > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs md:text-sm rounded-full w-4 h-4 md:w-6 md:h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            )}

            <ThemeToggle />

            {isMobile && nav && (
              <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 xs:h-10 xs:w-10">
                    <Menu size={18} />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-background border-l border-border p-0 rounded-l-xl w-[280px] sm:w-[320px] max-h-screen overflow-y-auto" side="right">
                  <MobileNavigation
                    nav={nav}
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

        {showBottomNav && (
        <div className="hidden md:flex items-center gap-3 md:gap-6 lg:gap-8 py-1.5 md:py-2 lg:py-3 border-t border-border">
          {showCategories && (
          <div className="relative group">
            <button className="flex items-center gap-1 text-xs md:text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              <span>{nav!.categoriesLabel}</span>
              <ChevronRight size={12} className="rotate-90" />
            </button>

            <div className="absolute top-full left-0 mt-1 md:mt-2 w-48 md:w-60 bg-popover rounded-lg shadow-lg border border-border py-1.5 md:py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="max-h-48 md:max-h-64 lg:max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${encodeURIComponent(category.slug)}`}
                    className="flex items-center justify-between px-2 md:px-4 py-1.5 md:py-2 hover:bg-accent text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span>{category.name}</span>
                    <ChevronRight size={10} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          )}

          {primaryLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              to={link.href}
              className="text-xs md:text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        )}
      </div>

      <CartSidebar
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <WishlistSidebar
        open={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </header>
  );
};

const MobileNavigation = ({
  nav,
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
  nav: NavbarUiContent;
  onClose: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  cartCount: number;
  wishlistCount: number;
  isAuthenticated: boolean;
  user: { fullName?: string | null } | null;
  siteName: string;
  logoUrl: string | null;
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const primaryLinks = nav.primaryLinks ?? [];
  const showShopSection = Boolean(nav.shopSectionTitle) && primaryLinks.length > 0;
  const showAccountSection = Boolean(nav.accountSectionTitle);

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

  const greetingName =
    user?.fullName?.split(' ')[0] ||
    nav.guestNameFallback ||
    null;

  return (
    <div className="flex flex-col h-full p-4 xs:p-6 text-foreground overflow-y-auto bg-background">
      <div className="flex justify-between items-center mb-6 xs:mb-8">
        <button onClick={onClose} className="flex items-center gap-2 min-w-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={siteName}
              className="h-10 w-10 object-contain shrink-0"
            />
          ) : null}
          {siteName && <span className="font-semibold text-sm truncate">{siteName}</span>}
        </button>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
      </div>

      {nav.searchPlaceholder && (
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder={nav.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full h-10 pr-10"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <Search size={18} />
          </button>
        </div>
      </div>
      )}

      <div className="flex-1">
        {showShopSection && (
        <nav className="mb-8">
          <h3 className="text-muted-foreground text-xs xs:text-sm font-semibold mb-3 uppercase tracking-wider px-2">
            {nav.shopSectionTitle}
          </h3>
          <div className="flex flex-col gap-2">
            {primaryLinks.map((link) => (
              <button
                key={`${link.href}-${link.label}`}
                onClick={() => handleNavigate(link.href)}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm hover:bg-accent transition-colors font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>
        </nav>
        )}

        {showAccountSection && (
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-xs xs:text-sm font-semibold mb-3 uppercase tracking-wider px-2">
            {nav.accountSectionTitle}
          </h3>

          {isAuthenticated ? (
            <>
              {nav.greetingPrefix && greetingName && (
              <div className="px-3 py-2 text-muted-foreground text-sm">
                {nav.greetingPrefix} {greetingName}
              </div>
              )}
              {nav.accountLabel && (
              <button
                onClick={() => handleNavigate("/account")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm bg-muted/50 hover:bg-accent transition-colors border border-border font-medium"
              >
                <User size={18} />
                <span>{nav.accountLabel}</span>
              </button>
              )}
              {nav.wishlistLabel && (
              <button
                onClick={() => handleNavigate("/wishlist")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm bg-muted/50 hover:bg-accent transition-colors border border-border font-medium"
              >
                <Heart size={18} />
                <span className="flex-1 text-left">{nav.wishlistLabel}</span>
                {wishlistCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </button>
              )}
              {nav.logoutLabel && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-red-500 bg-muted/50 hover:bg-red-500/10 transition-colors border border-red-500/30 font-medium"
              >
                <LogOut size={18} />
                <span>{nav.logoutLabel}</span>
              </button>
              )}
            </>
          ) : (
            <>
              {nav.loginLabel && (
              <button
                onClick={() => handleNavigate("/login")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm bg-muted/50 hover:bg-accent transition-colors border border-border font-medium"
              >
                <User size={18} />
                <span>{nav.loginLabel}</span>
              </button>
              )}
              {nav.registerLabel && (
              <button
                onClick={() => handleNavigate("/register")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm bg-muted/50 hover:bg-accent transition-colors border border-border font-medium"
              >
                <User size={18} />
                <span>{nav.registerLabel}</span>
              </button>
              )}
            </>
          )}

          {!isAuthenticated && nav.wishlistLabel && (
          <button
            onClick={onOpenWishlist}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm bg-muted/50 hover:bg-accent transition-colors border border-border font-medium"
          >
            <Heart size={18} />
            <span className="flex-1 text-left">{nav.wishlistLabel}</span>
            {wishlistCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-semibold">
                {wishlistCount}
              </span>
            )}
          </button>
          )}

          {nav.cartLabel && (
          <button
            onClick={onOpenCart}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium mt-4"
          >
            <ShoppingBag size={18} />
            <span className="flex-1 text-left">{nav.cartLabel}</span>
            {cartCount > 0 && (
              <span className="bg-primary-foreground/20 text-primary-foreground text-xs px-2 py-0.5 rounded-full font-semibold">
                {cartCount}
              </span>
            )}
          </button>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
