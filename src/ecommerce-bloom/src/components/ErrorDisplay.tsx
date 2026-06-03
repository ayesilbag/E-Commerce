import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

const ErrorDisplay = ({
  title = "Bir Hata Oluştu",
  message = "Üzgünüz, bir sorun oluştu. Lütfen daha sonra tekrar deneyin.",
  onRetry,
  showHomeButton = true
}: ErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-3 xs:p-4 md:p-8 text-center">
      <div className="bg-red-100 p-2.5 xs:p-3 md:p-4 rounded-full mb-4 xs:mb-5 md:mb-6">
        <AlertCircle className="h-10 xs:h-12 md:h-12 w-10 xs:w-12 md:w-12 text-red-600" />
      </div>

      <h2 className="text-base font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 max-w-md mb-4 text-xs">{message}</p>

      <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 md:gap-3 w-full xs:w-auto">
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-purple-gradient hover:opacity-90 text-white h-9 text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-3 xs:h-3.5 md:h-4 w-3 xs:w-3.5 md:w-4" />
            Tekrar Dene
          </Button>
        )}

        {showHomeButton && (
          <Button
            variant="outline"
            asChild
            className="min-w-[140px]"
          >
            <a href="/">
              <Home className="mr-2 h-4 w-4" />
              Ana Sayfa
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;