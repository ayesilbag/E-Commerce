import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uiLabel, useAppPagesUi } from "@/hooks/useAppPagesUi";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

const ErrorDisplay = ({
  title,
  message,
  onRetry,
  showHomeButton = true
}: ErrorDisplayProps) => {
  const global = useAppPagesUi()?.global;
  const resolvedTitle = title ?? uiLabel(global?.errorTitle);
  const resolvedMessage = message ?? uiLabel(global?.errorMessage);
  const retryLabel = uiLabel(global?.retryButtonLabel);
  const homeLabel = uiLabel(global?.homeButtonLabel);

  if (!resolvedTitle && !resolvedMessage) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-3 xs:p-4 md:p-8 text-center">
      <div className="bg-red-100 p-2.5 xs:p-3 md:p-4 rounded-full mb-4 xs:mb-5 md:mb-6">
        <AlertCircle className="h-10 xs:h-12 md:h-12 w-10 xs:w-12 md:w-12 text-red-600" />
      </div>

      {resolvedTitle && <h2 className="text-base font-semibold text-foreground mb-2">{resolvedTitle}</h2>}
      {resolvedMessage && <p className="text-muted-foreground max-w-md mb-4 text-xs">{resolvedMessage}</p>}

      <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 md:gap-3 w-full xs:w-auto">
        {onRetry && retryLabel && (
          <Button
            onClick={onRetry}
            className="bg-primary text-primary-foreground hover:opacity-90 h-9 text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-3 xs:h-3.5 md:h-4 w-3 xs:w-3.5 md:w-4" />
            {retryLabel}
          </Button>
        )}

        {showHomeButton && homeLabel && (
          <Button
            variant="outline"
            asChild
            className="min-w-[140px]"
          >
            <a href="/">
              <Home className="mr-2 h-4 w-4" />
              {homeLabel}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
