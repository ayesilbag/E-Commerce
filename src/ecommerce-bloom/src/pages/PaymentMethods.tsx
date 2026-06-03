import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader, CreditCard, ChevronLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { getPaymentMethods, type SavedPaymentMethod } from '@/services/payments.service';

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        setIsLoading(true);
        const methods = await getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ödeme yöntemleri yüklenirken hata oluştu';
        toast.error('Hata', { description: errorMessage });
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentMethods();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600">Yükleniyor...</p>
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
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/account')}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Hesabına Dön
            </Button>
            <h1 className="text-base font-semibold text-gray-900">
              Kayıtlı Ödeme Yöntemleri
            </h1>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-800 flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Kayıtlı kart bilgileriniz güvenli şekilde saklanır. Yeni kart eklemek için ödeme sırasında kaydet seçeneğini kullanabilirsiniz.</span>
            </p>
          </div>

          {paymentMethods.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">Henüz kayıtlı ödeme yönteminiz yok.</p>
              <Button variant="outline" onClick={() => navigate('/shop')} className="mx-auto">
                Alışverişe Başla
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card key={method.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-800 block">
                            {method.cardName || method.cardBrand || 'Kayıtlı Kart'}
                          </span>
                          {method.cardLast4 && (
                            <span className="text-sm text-gray-500">
                              **** {method.cardLast4}
                              {method.cardBrand ? ` · ${method.cardBrand}` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                          Varsayılan
                        </span>
                      )}
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
