import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, ChevronLeft, CheckCircle, ArrowRight, Trash2, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAddresses } from '@/contexts/AddressContext';
import type { Address, CreateAddressRequest } from '@/types';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

const CITIES = [
  { id: '34', name: 'İstanbul' },
  { id: '06', name: 'Ankara' },
  { id: '35', name: 'İzmir' },
  { id: '01', name: 'Adana' },
  { id: '02', name: 'Adıyaman' },
  { id: '03', name: 'Afyonkarahisar' },
  { id: '04', name: 'Ağrı' },
  { id: '05', name: 'Amasya' },
  { id: '07', name: 'Antalya' },
  { id: '08', name: 'Ardahan' },
  { id: '09', name: 'Artvin' },
  { id: '10', name: 'Aydın' },
  { id: '11', name: 'Balıkesir' },
  { id: '12', name: 'Bartın' },
  { id: '13', name: 'Batman' },
  { id: '14', name: 'Bayburt' },
  { id: '15', name: 'Bilecik' },
  { id: '16', name: 'Bingöl' },
  { id: '17', name: 'Bitlis' },
  { id: '18', name: 'Bolu' },
  { id: '19', name: 'Burdur' },
  { id: '20', name: 'Bursa' },
  { id: '21', name: 'Çanakkale' },
  { id: '22', name: 'Çankırı' },
  { id: '23', name: 'Çorum' },
  { id: '24', name: 'Denizli' },
  { id: '25', name: 'Diyarbakır' },
  { id: '26', name: 'Düzce' },
  { id: '27', name: 'Edirne' },
  { id: '28', name: 'Elazığ' },
  { id: '29', name: 'Erzincan' },
  { id: '30', name: 'Erzurum' },
  { id: '31', name: 'Eskişehir' },
  { id: '32', name: 'Gaziantep' },
  { id: '33', name: 'Giresun' },
  { id: '36', name: 'Gümüşhane' },
  { id: '37', name: 'Hakkari' },
  { id: '38', name: 'Hatay' },
  { id: '39', name: 'Iğdır' },
  { id: '40', name: 'Isparta' },
  { id: '41', name: 'Kahramanmaraş' },
  { id: '42', name: 'Karabük' },
  { id: '43', name: 'Karaman' },
  { id: '44', name: 'Kars' },
  { id: '45', name: 'Kastamonu' },
  { id: '46', name: 'Kayseri' },
  { id: '47', name: 'Kırklareli' },
  { id: '48', name: 'Kırşehir' },
  { id: '49', name: 'Kocaeli' },
  { id: '50', name: 'Konya' },
  { id: '51', name: 'Kütahya' },
  { id: '52', name: 'Malatya' },
  { id: '53', name: 'Manisa' },
  { id: '54', name: 'Mardin' },
  { id: '55', name: 'Mersin' },
  { id: '56', name: 'Muğla' },
  { id: '57', name: 'Muş' },
  { id: '58', name: 'Nevşehir' },
  { id: '59', name: 'Niğde' },
  { id: '60', name: 'Ordu' },
  { id: '61', name: 'Osmaniye' },
  { id: '62', name: 'Rize' },
  { id: '63', name: 'Sakarya' },
  { id: '64', name: 'Samsun' },
  { id: '65', name: 'Siirt' },
  { id: '66', name: 'Sinop' },
  { id: '67', name: 'Sivas' },
  { id: '68', name: 'Şanlıurfa' },
  { id: '69', name: 'Şırnak' },
  { id: '70', name: 'Tekirdağ' },
  { id: '71', name: 'Tokat' },
  { id: '72', name: 'Trabzon' },
  { id: '73', name: 'Tunceli' },
  { id: '74', name: 'Uşak' },
  { id: '75', name: 'Van' },
  { id: '76', name: 'Yalova' },
  { id: '77', name: 'Yozgat' },
  { id: '78', name: 'Zonguldak' },
];

const DISTRICTS: Record<string, string[]> = {
  '34': ['Adalar', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Esenyurt', 'Eyüp', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'],
  '06': ['Akyurt', 'Altındağ', 'Ayaş', 'Bala', 'Batıkent', 'Beypazarı', 'Çamlıdere', 'Çankaya', 'Çubuk', 'Elmadağ', 'Etimesgut', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Keçiören', 'Kalecik', 'Kazan', 'Mamak', 'Polatlı', 'Pursaklar', 'Sincan', 'Yenimahalle'],
  '35': ['Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Bornova', 'Buca', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun', 'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere', 'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'],
  'default': ['Merkez', 'İlçe 1', 'İlçe 2', 'İlçe 3'],
};

const Order = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useCart();
  const { user } = useAuth();
  const { addresses, addAddress, removeAddress } = useAddresses();

  // Sepet boşsa alışveriş sayfasına yönlendir
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop', { replace: true });
    }
  }, [cartItems.length, navigate]);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedAddressId((prev) => prev ?? addresses.find((a) => a.isDefault)?.id ?? null);
  }, [addresses]);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [districts, setDistricts] = useState<string[]>([]);

  const [formData, setFormData] = useState<CreateAddressRequest>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    country: 'Türkiye',
    isDefault: false,
    type: 0,
  });

  const handleCityChange = (cityName: string) => {
    const cityId = CITIES.find(c => c.name === cityName)?.id;
    setFormData(prev => ({ ...prev, city: cityName, district: '' }));
    if (cityId) {
      setDistricts(DISTRICTS[cityId] || DISTRICTS.default);
    } else {
      setDistricts(DISTRICTS.default);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddAddress = async () => {
    try {
      if (
        !formData.fullName ||
        !formData.phone ||
        !formData.address ||
        !formData.city ||
        !formData.district ||
        !formData.postalCode
      ) {
        toast.error('Hata', { description: 'Lütfen tüm gerekli alanları doldurun' });
        return;
      }

      setIsAdding(true);
      const newAddress = await addAddress(formData);
      setSelectedAddressId(newAddress.id);

      setFormData({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        postalCode: '',
        country: 'Türkiye',
        isDefault: false,
        type: 0,
      });
      setDistricts([]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding address:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm('Bu adresi silmek istediğinizden emin misiniz?')) return;

    try {
      await removeAddress(addressId);

      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleContinueToPayment = () => {
    if (!selectedAddressId) {
      toast.error('Hata', { description: 'Lütfen teslimat adresi seçin' });
      return;
    }
    navigate('/order/payment', { state: { selectedAddressId } });
  };

  const shippingCost = 89.90;
  const totalAmount = cartTotal + shippingCost;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex rounded-lg overflow-hidden shadow-sm mb-4">
            <button
              className="flex-1 py-4 text-sm font-semibold tracking-wide transition-colors bg-purple-600 text-white"
            >
              ADRES BİLGİLERİ
            </button>
            <button
              onClick={handleContinueToPayment}
              className="flex-1 py-4 text-sm font-semibold tracking-wide transition-colors bg-gray-200 text-gray-500 hover:bg-gray-300"
            >
              ÖDEME BİLGİLERİ
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left: Address List */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">Kayıtlı Adreslerim</h2>

              {addresses.length === 0 && !showAddForm ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Henüz bir adres eklenmemiş</p>
                </div>
              ) : (
                <RadioGroup value={selectedAddressId || ''} onValueChange={setSelectedAddressId}>
                  {addresses.map((address) => (
                    <div key={address.id}>
                      <label htmlFor={`address-${address.id}`} className="cursor-pointer">
                        <div className={`flex items-start gap-4 p-4 border-2 rounded-xl transition-all ${
                          selectedAddressId === address.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-gray-900">{address.fullName}</h3>
                              {address.isDefault && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Varsayılan</span>
                              )}
                            </div>
                            {address.phone && (
                              <p className="text-sm text-gray-600">Tel: {address.phone}</p>
                            )}
                            <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                            <p className="text-sm text-gray-600">{address.district} / {address.city} - {address.postalCode}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.preventDefault(); handleDeleteAddress(address.id); }}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {/* Add Address Form - Hidden by default */}
              {showAddForm && (
                <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Yeni Adres Ekle</h3>
                  <form className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Ad Soyad *</Label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Ad Soyad girin"
                        className="mt-1 rounded-lg h-11"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Telefon *</Label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+90 555 123 4567"
                        className="mt-1 rounded-lg h-11"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Adres *</Label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Sokak, mahalle, no..."
                        className="mt-1 rounded-lg h-11"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Şehir *</Label>
                        <Select
                          value={formData.city}
                          onValueChange={handleCityChange}
                        >
                          <SelectTrigger className="mt-1 rounded-lg h-11">
                            <SelectValue placeholder="Şehir seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {CITIES.map((city) => (
                              <SelectItem key={city.id} value={city.name}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">İlçe *</Label>
                        <Select
                          value={formData.district}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, district: value }))}
                          disabled={!formData.city}
                        >
                          <SelectTrigger className="mt-1 rounded-lg h-11">
                            <SelectValue placeholder={formData.city ? 'İlçe seçin' : 'Önce şehir'} />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Posta Kodu *</Label>
                      <Input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="34000"
                        className="mt-1 rounded-lg h-11"
                      />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      Varsayılan adres olarak ayarla
                    </label>

                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg h-11"
                        onClick={handleAddAddress}
                        disabled={isAdding}
                      >
                        {isAdding ? 'Ekleniyor...' : 'Adresi Kaydet'}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 rounded-lg h-11"
                        onClick={() => {
                          setShowAddForm(false);
                          setFormData({
                            fullName: '',
                            phone: '',
                            address: '',
                            city: '',
                            district: '',
                            postalCode: '',
                            country: 'Türkiye',
                            isDefault: false,
                            type: 0,
                          });
                          setDistricts([]);
                        }}
                      >
                        İptal
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="w-full lg:w-72 flex-shrink-0 space-y-3">
              {/* New Address Button */}
              <Button
                variant="outline"
                className="w-full border-2 border-dashed border-gray-300 rounded-lg h-11 text-gray-600 hover:border-purple-500 hover:text-purple-600 bg-white"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Adres Ekle
              </Button>

              {/* Summary Card */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-800">Sipariş Özeti</span>
                </div>

                <div className="px-4 py-3 space-y-3">
                  {cartItems.slice(0, 4).map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-start">
                      <div className="w-14 h-14 rounded overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 line-clamp-3 leading-snug">{item.product.name}</p>
                        <p className="text-xs font-semibold text-gray-900 mt-1">
                          {((item.product.price || 0) * item.quantity).toFixed(2)} TL
                        </p>
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 4 && (
                    <p className="text-xs text-gray-400 text-center">+ {cartItems.length - 4} ürün daha</p>
                  )}
                </div>

                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Sepet Toplamı</span>
                    <span className="font-medium">{cartTotal.toFixed(2)} TL</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Kargo Ücreti</span>
                    <span className="font-medium">{shippingCost.toFixed(2)} TL</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-gray-100">
                    <span>Genel Toplam</span>
                    <span className="text-purple-700">{totalAmount.toFixed(2)} TL</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-12 text-sm font-semibold"
                onClick={handleContinueToPayment}
              >
                Ödemeye Geç
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Order;