import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createAddress, updateAddress, deleteAddress } from '@/services/users.service';
import type { Address, CreateAddressRequest, UpdateAddressRequest } from '@/types';
import { toast } from 'sonner';

interface AddressContextType {
  addresses: Address[];
  loading: boolean;
  addAddress: (data: CreateAddressRequest) => Promise<Address>;
  updateAddress: (id: string, data: UpdateAddressRequest) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  refreshAddresses: () => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const { user, getUserInfo } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAddresses(user?.addresses ?? []);
  }, [user]);

  const refreshAddresses = async () => {
    try {
      setLoading(true);
      await getUserInfo();
    } catch (error) {
      console.error('Failed to refresh addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (data: CreateAddressRequest): Promise<Address> => {
    try {
      setLoading(true);
      const currentDefault = addresses.find((a) => a.isDefault);
      const willBeDefault = data.isDefault || addresses.length === 0;

      const createdAddress = await createAddress({ ...data, isDefault: willBeDefault });

      if (!createdAddress?.id) {
        throw new Error('Adres kimliği alınamadı');
      }

      const newAddress: Address = {
        id: createdAddress.id,
        userId: createdAddress.userId,
        fullName: createdAddress.fullName ?? data.fullName,
        phone: createdAddress.phone ?? data.phone,
        address: createdAddress.address ?? data.address,
        city: createdAddress.city ?? data.city,
        district: createdAddress.district ?? data.district,
        postalCode: createdAddress.postalCode ?? data.postalCode,
        country: createdAddress.country ?? data.country,
        isDefault: createdAddress.isDefault ?? willBeDefault,
        type: createdAddress.type ?? 'home',
        createdAt: createdAddress.createdAt,
      };

      setAddresses((prev) => {
        const updated = willBeDefault && currentDefault
          ? prev.map((a) => (a.id === currentDefault.id ? { ...a, isDefault: false } : a))
          : prev;
        return [...updated, newAddress];
      });

      await getUserInfo();

      toast.success('Başarılı', { description: 'Adres eklendi' });
      return newAddress;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Adres eklenirken hata oluştu';
      toast.error('Hata', { description: errorMessage });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAddressData = async (id: string, data: UpdateAddressRequest) => {
    try {
      setLoading(true);
      const currentDefault = addresses.find((a) => a.isDefault);
      const willBeDefault = data.isDefault || addresses.length === 1;

      await updateAddress(id, { ...data, isDefault: willBeDefault });

      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === id) return { ...a, ...data, isDefault: data.isDefault };
          if (data.isDefault && a.isDefault) return { ...a, isDefault: false };
          return a;
        })
      );

      toast.success('Başarılı', { description: 'Adres güncellendi' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Adres güncellenirken hata oluştu';
      toast.error('Hata', { description: errorMessage });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeAddress = async (id: string) => {
    try {
      setLoading(true);
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success('Başarılı', { description: 'Adres silindi' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Adres silinirken hata oluştu';
      toast.error('Hata', { description: errorMessage });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddressContext.Provider
      value={{ addresses, loading, addAddress, updateAddress: updateAddressData, removeAddress, refreshAddresses }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddresses = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddresses must be used within AddressProvider');
  }
  return context;
};