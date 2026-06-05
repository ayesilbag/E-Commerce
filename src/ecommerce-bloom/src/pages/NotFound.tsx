import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="text-8xl font-bold text-purple-100 mb-2 select-none">404</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Sayfa Bulunamadı</h1>
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{location.pathname}</span>
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="btn-gradient w-full sm:w-auto gap-2">
                <Home size={16} />
                Ana Sayfaya Dön
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <Search size={16} />
                Ürünleri Keşfet
              </Button>
            </Link>
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-4 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mx-auto transition-colors"
          >
            <ArrowLeft size={12} />
            Önceki sayfaya dön
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
