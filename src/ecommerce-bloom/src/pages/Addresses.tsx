import { useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MapPin, Trash2, Plus, ChevronLeft, Edit, CheckCircle, MapPinned } from 'lucide-react';
import { useAddresses } from '@/contexts/AddressContext';
import type { Address, CreateAddressRequest, UpdateAddressRequest } from '@/types';

// Türkiye şehirleri
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

// İlçe verileri (basit örnek)
const DISTRICTS: Record<string, string[]> = {
  '34': ['Adalar', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Bünyemin', 'Çatalca', 'Esenyurt', 'Eyüp', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'],
  '06': ['Akyurt', 'Altındağ', 'Ayaş', 'Bala', 'Batıkent', 'Beypazarı', 'Çamlıdere', 'Çankaya', 'Çubuk', 'Elmadağ', 'Etimesgut', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Keçiören', 'Kalecik', 'Kazan', 'Mamak', 'Polatlı', 'Pursaklar', 'Sincan', 'Şereflikoçuş', 'Yenimahalle'],
  '35': ['Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Bornova', 'Buca', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun', 'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere', 'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'],
  'default': ['Merkez', 'İlçe 1', 'İlçe 2', 'İlçe 3'],
};

const Addresses = () => {
  const navigate = useNavigate();
  const { addresses, addAddress, updateAddress: updateAddressContext, removeAddress } = useAddresses();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [districts, setDistricts] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateAddressRequest, string>>>({});

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

  const validate = (): boolean => {
    const e: Partial<Record<keyof CreateAddressRequest, string>> = {};
    if (!formData.fullName.trim()) e.fullName = 'Ad soyad zorunludur';
    if (!formData.phone.trim()) e.phone = 'Telefon zorunludur';
    if (!formData.address.trim()) e.address = 'Adres zorunludur';
    if (!formData.city) e.city = 'Şehir seçiniz';
    if (!formData.district) e.district = 'İlçe seçiniz';
    if (!formData.postalCode.trim()) e.postalCode = 'Posta kodu zorunludur';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Update districts when city changes
  const handleCityChange = (cityName: string) => {
    const cityId = CITIES.find(c => c.name === cityName)?.id;
    setFormData(prev => ({ ...prev, city: cityName, district: '' }));
    if (cityId) {
      setDistricts(DISTRICTS[cityId] || DISTRICTS.default);
    } else {
      setDistricts(DISTRICTS.default);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name as keyof CreateAddressRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddAddress = async () => {
    if (!validate()) return;

    const payload = { ...formData };

    try {
      setIsAdding(true);
      await addAddress(payload);

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
      setErrors({});
    } catch (error) {
      console.error('Error adding address:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await removeAddress(addressId);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleUpdateAddress = async (addressId: string) => {
    if (!validate()) return;
    try {
      const updateData: UpdateAddressRequest = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        postalCode: formData.postalCode,
        country: formData.country,
        isDefault: formData.isDefault,
      };

      await updateAddressContext(addressId, updateData);

      setEditingId(null);
      setDistricts([]);
      setErrors({});
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
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const startEditing = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      fullName: address.fullName,
      phone: address.phone || '',
      address: address.address,
      city: address.city,
      district: address.district || '',
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
      type: 0,
    });

    // Load districts for the city
    const cityId = CITIES.find(c => c.name === address.city)?.id;
    if (cityId) {
      setDistricts(DISTRICTS[cityId] || DISTRICTS.default);
    } else {
      setDistricts(DISTRICTS.default);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/account')}
              className="gap-1 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
              Hesabım
            </Button>
          </div>

          <h1 className="text-base font-semibold text-gray-900 mb-8">Adreslerim</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Existing Addresses */}
            <div className="lg:col-span-2 space-y-4">
              {addresses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <MapPinned className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-sm">Henüz bir adres eklenmemiş</p>
                  <p className="text-gray-400 text-sm mt-2">Yeni adres eklemek için formu kullanın</p>
                </div>
              ) : (
                addresses.map((address) => (
                  <div
                    key={address.id}
                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{address.fullName}</h3>
                          {address.isDefault && (
                            <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full mt-1">
                              <CheckCircle className="w-3 h-3" />
                              Varsayılan Adres
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(address)}
                          className="text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Adresi sil</AlertDialogTitle>
                              <AlertDialogDescription>
                                <span className="font-medium">{address.fullName}</span> adresini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAddress(address.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="pl-[4.5rem] space-y-1.5 text-gray-600">
                      <p className="leading-relaxed">{address.address}</p>
                      <p className="text-sm">
                        {address.district} / {address.city} - {address.postalCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        {address.country}
                      </p>
                      <p className="text-sm text-gray-500">
                        Tel: {address.phone}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add/Edit Address Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-600" />
                  {editingId ? 'Adresi Düzenle' : 'Adres Ekle'}
                </h2>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Ad Soyad *</label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Ad Soyad girin"
                      className={`rounded-xl ${errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Telefon *</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+90 555 123 4567"
                      className={`rounded-xl ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Adres *</label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Sokak, mahalle, no..."
                      className={`rounded-xl ${errors.address ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Şehir *</label>
                      <Select
                        value={formData.city}
                        onValueChange={(v) => {
                          handleCityChange(v);
                          if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
                        }}
                      >
                        <SelectTrigger className={`rounded-xl ${errors.city ? 'border-red-500' : ''}`}>
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
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">İlçe *</label>
                      <Select
                        value={formData.district}
                        onValueChange={(v) => {
                          setFormData((prev) => ({ ...prev, district: v }));
                          if (errors.district) setErrors((prev) => ({ ...prev, district: undefined }));
                        }}
                        disabled={!formData.city}
                      >
                        <SelectTrigger className={`rounded-xl ${errors.district ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder={formData.city ? 'İlçe seçin' : 'Önce şehir'} />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Mevcut district listede yoksa (API'den gelen) üste göster */}
                          {formData.district && !districts.includes(formData.district) && (
                            <SelectItem value={formData.district}>{formData.district}</SelectItem>
                          )}
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Posta Kodu *</label>
                    <Input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="34000"
                      className={`rounded-xl ${errors.postalCode ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
                  </div>

                  <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    Varsayılan adres olarak ayarla
                  </label>

                  <div className="flex gap-3 pt-2">
                    {editingId ? (
                      <>
                        <Button
                          type="button"
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11"
                          onClick={(e) => { e.preventDefault(); handleUpdateAddress(editingId); }}
                          disabled={isAdding}
                        >
                          {isAdding ? 'Güncelleniyor...' : 'Güncelle'}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl h-11"
                          onClick={() => {
                            setEditingId(null);
                            setDistricts([]);
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
                            setErrors({});
                          }}
                        >
                          İptal
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11"
                        onClick={(e) => { e.preventDefault(); handleAddAddress(); }}
                        disabled={isAdding}
                      >
                        {isAdding ? 'Ekleniyor...' : 'Adresi Kaydet'}
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Addresses;