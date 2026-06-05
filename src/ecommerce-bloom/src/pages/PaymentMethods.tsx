import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader, CreditCard, ChevronLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { getPaymentMethods, type SavedPaymentMethod } from '@/services/payments.service';
import { uiLabel, useAppPagesUi } from '@/hooks/useAppPagesUi';

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const checkout = useAppPagesUi()?.checkout;
  const global = useAppPagesUi()?.global;
  const loadingLabel = uiLabel(global?.loadingLabel);
  const pageTitle = uiLabel(checkout?.paymentMethodsPageTitle);
  const backNav = uiLabel(checkout?.paymentMethodsBackNav);
  const securityNote = uiLabel(checkout?.paymentMethodsSecurityNote);
  const emptyMessage = uiLabel(checkout?.paymentMethodsEmpty);
  const loadError = uiLabel(checkout?.paymentMethodsLoadError);
  const cardFallback = uiLabel(checkout?.paymentMethodsCardFallback);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        setIsLoading(true);
        const methods = await getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : loadError;
        if (errorMessage) {
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentMethods();
  }, [loadError]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            {loadingLabel && (
              <p className="text-muted-foreground">{loadingLabel}</p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {(backNav || pageTitle) && (
          <div className="flex items-center gap-2 mb-6">
            {backNav && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/account')}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              {backNav}
            </Button>
            )}
            {pageTitle && (
            <h1 className="text-base font-semibold text-foreground">
              {pageTitle}
            </h1>
            )}
          </div>
          )}

          {securityNote && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-primary flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0" />
              <span>{securityNote}</span>
            </p>
          </div>
          )}

          {paymentMethods.length === 0 ? (
            emptyMessage && (
            <div className="text-center py-12 bg-card rounded-lg border-2 border-dashed border-border">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">{emptyMessage}</p>
            </div>
            )
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card key={method.id} className="bg-card rounded-lg border border-border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium text-foreground block">
                            {method.cardName || method.cardBrand || cardFallback}
                          </span>
                          {method.cardLast4 && (
                            <span className="text-sm text-muted-foreground">
                              **** {method.cardLast4}
                              {method.cardBrand ? ` · ${method.cardBrand}` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentMethods;
