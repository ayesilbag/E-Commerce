import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Log error to error reporting service (optional)
    // logErrorToService(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Reload the page to reset application state
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
            </div>

            <h1 className="text-base font-semibold text-gray-900 mb-2">
              Bir Hata Oluştu
            </h1>

            <p className="text-gray-600 mb-6">
              Üzgünüz, beklenmeyen bir hata oluştu. Sayfayı yenileyerek tekrar deneyebilirsiniz.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left overflow-auto max-h-48">
                <p className="text-xs font-mono text-red-600 mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <p className="text-xs font-mono text-gray-600">
                    {this.state.errorInfo.componentStack}
                  </p>
                )}
              </div>
            )}

            <Button
              onClick={this.handleReset}
              className="w-full bg-purple-gradient hover:opacity-90 text-white"
            >
              Sayfayı Yenile
            </Button>

            <div className="mt-4">
              <Button
                variant="link"
                asChild
                className="text-gray-600"
              >
                <a href="/">Ana Sayfaya Dön</a>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;