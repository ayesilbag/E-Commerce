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
import { toast } from 'sonner';
import { uiLabel, useAppPagesUi } from '@/hooks/useAppPagesUi';

const Addresses = () => {
  const navigate = useNavigate();
  const { addresses, addAddress, updateAddress: updateAddressContext, removeAddress } = useAddresses();
  const checkout = useAppPagesUi()?.checkout;
  const global = useAppPagesUi()?.global;

  const cities = checkout?.cities ?? [];
  const districtsByCity = checkout?.districtsByCity ?? {};
  const defaultCountry = checkout?.defaultCountry ?? '';

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [districts, setDistricts] = useState<string[]>([]);
  const [invalidFields, setInvalidFields] = useState<Partial<Record<keyof CreateAddressRequest, boolean>>>({});

  const emptyFormData = (): CreateAddressRequest => ({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    country: defaultCountry,
    isDefault: false,
    type: 0,
  });

  const [formData, setFormData] = useState<CreateAddressRequest>(emptyFormData());

  const validate = (): boolean => {
    const e: Partial<Record<keyof CreateAddressRequest, boolean>> = {};
    if (!formData.fullName.trim()) e.fullName = true;
    if (!formData.phone.trim()) e.phone = true;
    if (!formData.address.trim()) e.address = true;
    if (!formData.city) e.city = true;
    if (!formData.district) e.district = true;
    if (!formData.postalCode.trim()) e.postalCode = true;
    setInvalidFields(e);
    if (Object.keys(e).length > 0) {
      const title = uiLabel(checkout?.validationErrorTitle) ?? uiLabel(global?.errorTitle);
      const description = uiLabel(checkout?.validationErrorMessage);
      if (title || description) {
        toast.error(title ?? '', { description });
      }
    }
    return Object.keys(e).length === 0;
  };

  const handleCityChange = (cityName: string) => {
    setFormData((prev) => ({ ...prev, city: cityName, district: '' }));
    setDistricts(districtsByCity[cityName] ?? []);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (invalidFields[name as keyof CreateAddressRequest]) {
      setInvalidFields((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddAddress = async () => {
    if (!validate()) return;

    const payload = { ...formData };

    try {
      setIsAdding(true);
      await addAddress(payload);

      setFormData(emptyFormData());
      setDistricts([]);
      setInvalidFields({});
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
      setInvalidFields({});
      setFormData(emptyFormData());
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

    setDistricts(districtsByCity[address.city] ?? []);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/50">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            {uiLabel(checkout?.addressesBackNav) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/account')}
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
                {checkout!.addressesBackNav}
              </Button>
            )}
          </div>

          {uiLabel(checkout?.addressesPageTitle) && (
            <h1 className="text-base font-semibold text-foreground mb-8">{checkout!.addressesPageTitle}</h1>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {addresses.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl border-2 border-dashed border-border">
                  <MapPinned className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  {uiLabel(checkout?.addressesEmptyLine1) && (
                    <p className="text-muted-foreground text-sm">{checkout!.addressesEmptyLine1}</p>
                  )}
                  {uiLabel(checkout?.addressesEmptyLine2) && (
                    <p className="text-muted-foreground text-sm mt-2">{checkout!.addressesEmptyLine2}</p>
                  )}
                </div>
              ) : (
                addresses.map((address) => (
                  <div
                    key={address.id}
                    className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm">{address.fullName}</h3>
                          {address.isDefault && uiLabel(checkout?.addressesDefaultBadge) && (
                            <span className="inline-flex items-center gap-1 text-xs bg-primary/15 text-primary px-2.5 py-1 rounded-full mt-1">
                              <CheckCircle className="w-3 h-3" />
                              {checkout!.addressesDefaultBadge}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(address)}
                          className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              {uiLabel(checkout?.addressesDeleteTitle) && (
                                <AlertDialogTitle>{checkout!.addressesDeleteTitle}</AlertDialogTitle>
                              )}
                              {uiLabel(checkout?.addressesDeleteDescription) && (
                                <AlertDialogDescription>
                                  <span className="font-medium">{address.fullName}</span>{' '}
                                  {checkout!.addressesDeleteDescription}
                                </AlertDialogDescription>
                              )}
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              {uiLabel(checkout?.cancelButton) && (
                                <AlertDialogCancel>{checkout!.cancelButton}</AlertDialogCancel>
                              )}
                              {uiLabel(checkout?.addressesDeleteConfirm) && (
                                <AlertDialogAction
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  {checkout!.addressesDeleteConfirm}
                                </AlertDialogAction>
                              )}
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="pl-[4.5rem] space-y-1.5 text-muted-foreground">
                      <p className="leading-relaxed">{address.address}</p>
                      <p className="text-sm">
                        {address.district} / {address.city} - {address.postalCode}
                      </p>
                      <p className="text-sm text-muted-foreground">{address.country}</p>
                      {address.phone && (
                        <p className="text-sm text-muted-foreground">
                          {uiLabel(checkout?.phonePrefix)
                            ? `${checkout!.phonePrefix} ${address.phone}`
                            : address.phone}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 border border-border sticky top-6">
                {(editingId ? uiLabel(checkout?.addressesEditTitle) : uiLabel(checkout?.addressesAddTitle)) && (
                  <h2 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    {editingId ? checkout!.addressesEditTitle : checkout!.addressesAddTitle}
                  </h2>
                )}

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
                  {uiLabel(checkout?.fullNameLabel) && (
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">
                        {checkout!.fullNameLabel}
                      </label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder={uiLabel(checkout?.fullNamePlaceholder) ?? ''}
                        className={`rounded-xl ${invalidFields.fullName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      />
                    </div>
                  )}

                  {uiLabel(checkout?.phoneLabel) && (
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">
                        {checkout!.phoneLabel}
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+90 555 123 4567"
                        className={`rounded-xl ${invalidFields.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      />
                    </div>
                  )}

                  {uiLabel(checkout?.addressLabel) && (
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">
                        {checkout!.addressLabel}
                      </label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder={uiLabel(checkout?.addressPlaceholder) ?? ''}
                        className={`rounded-xl ${invalidFields.address ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {uiLabel(checkout?.cityLabel) && (
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">
                          {checkout!.cityLabel}
                        </label>
                        <Select
                          value={formData.city}
                          onValueChange={(v) => {
                            handleCityChange(v);
                            if (invalidFields.city) setInvalidFields((prev) => ({ ...prev, city: undefined }));
                          }}
                        >
                          <SelectTrigger className={`rounded-xl ${invalidFields.city ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder={uiLabel(checkout?.cityPlaceholder) ?? ''} />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {uiLabel(checkout?.districtLabel) && (
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">
                          {checkout!.districtLabel}
                        </label>
                        <Select
                          value={formData.district}
                          onValueChange={(v) => {
                            setFormData((prev) => ({ ...prev, district: v }));
                            if (invalidFields.district) setInvalidFields((prev) => ({ ...prev, district: undefined }));
                          }}
                          disabled={!formData.city}
                        >
                          <SelectTrigger className={`rounded-xl ${invalidFields.district ? 'border-red-500' : ''}`}>
                            <SelectValue
                              placeholder={
                                formData.city
                                  ? (uiLabel(checkout?.districtPlaceholder) ?? '')
                                  : (uiLabel(checkout?.districtSelectCityFirst) ?? '')
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
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
                      </div>
                    )}
                  </div>

                  {uiLabel(checkout?.postalCodeLabel) && (
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">
                        {checkout!.postalCodeLabel}
                      </label>
                      <Input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="34000"
                        className={`rounded-xl ${invalidFields.postalCode ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      />
                    </div>
                  )}

                  {uiLabel(checkout?.defaultAddressCheckbox) && (
                    <label className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      {checkout!.defaultAddressCheckbox}
                    </label>
                  )}

                  <div className="flex gap-3 pt-2">
                    {editingId ? (
                      <>
                        {uiLabel(checkout?.addressesUpdateButton) && (
                          <Button
                            type="button"
                            className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl h-11"
                            onClick={(e) => { e.preventDefault(); handleUpdateAddress(editingId); }}
                            disabled={isAdding}
                          >
                            {isAdding
                              ? (uiLabel(checkout?.addressesUpdateSubmitting) ?? checkout!.addressesUpdateButton)
                              : checkout!.addressesUpdateButton}
                          </Button>
                        )}
                        {uiLabel(checkout?.cancelButton) && (
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 rounded-xl h-11"
                            onClick={() => {
                              setEditingId(null);
                              setDistricts([]);
                              setFormData(emptyFormData());
                              setInvalidFields({});
                            }}
                          >
                            {checkout!.cancelButton}
                          </Button>
                        )}
                      </>
                    ) : (
                      uiLabel(checkout?.saveAddressButton) && (
                        <Button
                          type="button"
                          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11"
                          onClick={(e) => { e.preventDefault(); handleAddAddress(); }}
                          disabled={isAdding}
                        >
                          {isAdding
                            ? (uiLabel(checkout?.saveAddressSubmitting) ?? checkout!.saveAddressButton)
                            : checkout!.saveAddressButton}
                        </Button>
                      )
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
