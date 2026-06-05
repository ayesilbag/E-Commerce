import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const NotFound = () => {
  const location = useLocation();
  const { storefrontContent } = useSiteSettings();
  const page = storefrontContent?.notFound;

  if (!page?.title) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1" />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="text-8xl font-bold text-primary/20 mb-2 select-none">404</div>
          <h1 className="text-xl font-semibold text-foreground mb-2">{page.title}</h1>
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{location.pathname}</span>
          </p>
          {page.description && (
            <p className="text-sm text-muted-foreground mb-8">{page.description}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {page.primaryButtonLabel && page.primaryButtonHref && (
              <Link to={page.primaryButtonHref}>
                <Button className="btn-gradient w-full sm:w-auto gap-2">
                  <Home size={16} />
                  {page.primaryButtonLabel}
                </Button>
              </Link>
            )}
            {page.secondaryButtonLabel && page.secondaryButtonHref && (
              <Link to={page.secondaryButtonHref}>
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <Search size={16} />
                  {page.secondaryButtonLabel}
                </Button>
              </Link>
            )}
          </div>
          {page.backLinkLabel && (
            <button
              onClick={() => window.history.back()}
              className="mt-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-muted-foreground mx-auto transition-colors"
            >
              <ArrowLeft size={12} />
              {page.backLinkLabel}
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
