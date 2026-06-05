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
import { MapPin, ArrowRight, Trash2, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAddresses } from '@/contexts/AddressContext';
import type { CreateAddressRequest } from '@/types';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { uiLabel, useAppPagesUi } from '@/hooks/useAppPagesUi';

const Order = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useCart();
  const { user } = useAuth();
  const { addresses, addAddress, removeAddress } = useAddresses();
  const checkout = useAppPagesUi()?.checkout;
  const global = useAppPagesUi()?.global;

  const cities = checkout?.cities ?? [];
  const districtsByCity = checkout?.districtsByCity ?? {};
  const defaultCountry = checkout?.defaultCountry ?? '';

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

  const handleCityChange = (cityName: string) => {
    setFormData((prev) => ({ ...prev, city: cityName, district: '' }));
    setDistricts(districtsByCity[cityName] ?? []);
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
        const title = uiLabel(checkout?.validationErrorTitle) ?? uiLabel(global?.errorTitle);
        const description = uiLabel(checkout?.validationErrorMessage);
        if (title || description) {
          toast.error(title ?? '', { description });
        }
        return;
      }

      setIsAdding(true);
      const newAddress = await addAddress(formData);
      setSelectedAddressId(newAddress.id);

      setFormData(emptyFormData());
      setDistricts([]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding address:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    const confirmMessage = uiLabel(checkout?.deleteAddressConfirm);
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    if (!confirmMessage) return;

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
      const title = uiLabel(checkout?.validationErrorTitle) ?? uiLabel(global?.errorTitle);
      const description = uiLabel(checkout?.selectAddressError);
      if (title || description) {
        toast.error(title ?? '', { description });
      }
      return;
    }
    navigate('/order/payment', { state: { selectedAddressId } });
  };

  const shippingCost = 89.90;
  const totalAmount = cartTotal + shippingCost;

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex rounded-lg overflow-hidden shadow-sm mb-4">
            {uiLabel(checkout?.addressTabLabel) && (
              <button
                type="button"
                className="flex-1 py-4 text-sm font-semibold tracking-wide transition-colors bg-primary text-white"
              >
                {checkout!.addressTabLabel}
              </button>
            )}
            {uiLabel(checkout?.paymentTabLabel) && (
              <button
                type="button"
                onClick={handleContinueToPayment}
                className="flex-1 py-4 text-sm font-semibold tracking-wide transition-colors bg-gray-200 text-muted-foreground hover:bg-gray-300"
              >
                {checkout!.paymentTabLabel}
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 bg-card rounded-lg shadow-sm p-5">
              {uiLabel(checkout?.savedAddressesTitle) && (
                <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                  {checkout!.savedAddressesTitle}
                </h2>
              )}

              {addresses.length === 0 && !showAddForm ? (
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  {uiLabel(checkout?.noAddressYet) && (
                    <p className="text-muted-foreground">{checkout!.noAddressYet}</p>
                  )}
                </div>
              ) : (
                <RadioGroup value={selectedAddressId || ''} onValueChange={setSelectedAddressId}>
                  {addresses.map((address) => (
                    <div key={address.id}>
                      <label htmlFor={`address-${address.id}`} className="cursor-pointer">
                        <div className={`flex items-start gap-4 p-4 border-2 rounded-xl transition-all ${
                          selectedAddressId === address.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-border'
                        }`}>
                          <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-foreground">{address.fullName}</h3>
                              {address.isDefault && uiLabel(checkout?.defaultAddressBadge) && (
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                  {checkout!.defaultAddressBadge}
                                </span>
                              )}
                            </div>
                            {address.phone && (
                              <p className="text-sm text-muted-foreground">
                                {uiLabel(checkout?.phonePrefix) ? `${checkout!.phonePrefix} ${address.phone}` : address.phone}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">{address.address}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.district} / {address.city} - {address.postalCode}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.preventDefault(); handleDeleteAddress(address.id); }}
                            className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {showAddForm && (
                <div className="mt-6 p-6 bg-muted/50 rounded-xl">
                  {uiLabel(checkout?.addAddressTitle) && (
                    <h3 className="text-sm font-medium text-foreground mb-4">{checkout!.addAddressTitle}</h3>
                  )}
                  <form className="space-y-4">
                    {uiLabel(checkout?.fullNameLabel) && (
                      <div>
                        <Label className="text-sm font-medium text-foreground">{checkout!.fullNameLabel}</Label>
                        <Input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder={uiLabel(checkout?.fullNamePlaceholder) ?? ''}
                          className="mt-1 rounded-lg h-11"
                        />
                      </div>
                    )}

                    {uiLabel(checkout?.phoneLabel) && (
                      <div>
                        <Label className="text-sm font-medium text-foreground">{checkout!.phoneLabel}</Label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+90 555 123 4567"
                          className="mt-1 rounded-lg h-11"
                        />
                      </div>
                    )}

                    {uiLabel(checkout?.addressLabel) && (
                      <div>
                        <Label className="text-sm font-medium text-foreground">{checkout!.addressLabel}</Label>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder={uiLabel(checkout?.addressPlaceholder) ?? ''}
                          className="mt-1 rounded-lg h-11"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      {uiLabel(checkout?.cityLabel) && (
                        <div>
                          <Label className="text-sm font-medium text-foreground">{checkout!.cityLabel}</Label>
                          <Select value={formData.city} onValueChange={handleCityChange}>
                            <SelectTrigger className="mt-1 rounded-lg h-11">
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
                          <Label className="text-sm font-medium text-foreground">{checkout!.districtLabel}</Label>
                          <Select
                            value={formData.district}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, district: value }))}
                            disabled={!formData.city}
                          >
                            <SelectTrigger className="mt-1 rounded-lg h-11">
                              <SelectValue
                                placeholder={
                                  formData.city
                                    ? (uiLabel(checkout?.districtPlaceholder) ?? '')
                                    : (uiLabel(checkout?.districtSelectCityFirst) ?? '')
                                }
                              />
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
                      )}
                    </div>

                    {uiLabel(checkout?.postalCodeLabel) && (
                      <div>
                        <Label className="text-sm font-medium text-foreground">{checkout!.postalCodeLabel}</Label>
                        <Input
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          placeholder="34000"
                          className="mt-1 rounded-lg h-11"
                        />
                      </div>
                    )}

                    {uiLabel(checkout?.defaultAddressCheckbox) && (
                      <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={formData.isDefault}
                          onChange={handleChange}
                          className="w-4 h-4 rounded border-border"
                        />
                        {checkout!.defaultAddressCheckbox}
                      </label>
                    )}

                    <div className="flex gap-3">
                      {uiLabel(checkout?.saveAddressButton) && (
                        <Button
                          type="button"
                          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg h-11"
                          onClick={handleAddAddress}
                          disabled={isAdding}
                        >
                          {isAdding
                            ? (uiLabel(checkout?.saveAddressSubmitting) ?? checkout!.saveAddressButton)
                            : checkout!.saveAddressButton}
                        </Button>
                      )}
                      {uiLabel(checkout?.cancelButton) && (
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 rounded-lg h-11"
                          onClick={() => {
                            setShowAddForm(false);
                            setFormData(emptyFormData());
                            setDistricts([]);
                          }}
                        >
                          {checkout!.cancelButton}
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="w-full lg:w-72 flex-shrink-0 space-y-3">
              {uiLabel(checkout?.addAddressButton) && (
                <Button
                  variant="outline"
                  className="w-full border-2 border-dashed border-border rounded-lg h-11 text-muted-foreground hover:border-primary hover:text-primary bg-background"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {checkout!.addAddressButton}
                </Button>
              )}

              <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                {uiLabel(checkout?.orderSummaryTitle) && (
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-sm font-semibold text-foreground">{checkout!.orderSummaryTitle}</span>
                  </div>
                )}

                <div className="px-4 py-3 space-y-3">
                  {cartItems.slice(0, 4).map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-start">
                      <div className="w-14 h-14 rounded overflow-hidden bg-muted flex-shrink-0 border border-border">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground line-clamp-3 leading-snug">{item.product.name}</p>
                        <p className="text-xs font-semibold text-foreground mt-1">
                          {((item.product.price || 0) * item.quantity).toFixed(2)} TL
                        </p>
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 4 && uiLabel(checkout?.moreItemsNote) && (
                    <p className="text-xs text-muted-foreground text-center">
                      {checkout!.moreItemsNote!.replace('{count}', String(cartItems.length - 4))}
                    </p>
                  )}
                </div>

                <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
                  {uiLabel(checkout?.cartTotalLabel) && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{checkout!.cartTotalLabel}</span>
                      <span className="font-medium">{cartTotal.toFixed(2)} TL</span>
                    </div>
                  )}
                  {uiLabel(checkout?.shippingFeeLabel) && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{checkout!.shippingFeeLabel}</span>
                      <span className="font-medium">{shippingCost.toFixed(2)} TL</span>
                    </div>
                  )}
                  {uiLabel(checkout?.grandTotalLabel) && (
                    <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-border">
                      <span>{checkout!.grandTotalLabel}</span>
                      <span className="text-primary">{totalAmount.toFixed(2)} TL</span>
                    </div>
                  )}
                </div>
              </div>

              {uiLabel(checkout?.continueToPaymentButton) && (
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-12 text-sm font-semibold"
                  onClick={handleContinueToPayment}
                >
                  {checkout!.continueToPaymentButton}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Order;
