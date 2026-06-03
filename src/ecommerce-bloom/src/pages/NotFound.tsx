import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">404</h1>
        <p className="text-sm text-gray-600 mb-4 xs:mb-6 md:mb-6">Oops! Sayfa bulunamadı</p>
        <a href="/" className="text-purple-default hover:text-purple-dark underline text-xs font-medium">
          Anasayfaya Dön
        </a>
      </div>
    </div>
  );
};

export default NotFound;
