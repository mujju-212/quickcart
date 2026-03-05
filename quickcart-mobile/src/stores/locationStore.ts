import { create } from 'zustand';
import { Address } from '@services/addressService';
import { Storage } from '@utils/storage';
import { STORAGE_KEYS } from '@utils/constants';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface LocationState {
  addresses: Address[];
  selectedAddress: Address | null;
  deliveryLocation: string;

  // Actions
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  updateAddress: (id: number, updates: Partial<Address>) => void;
  removeAddress: (id: number) => void;
  selectAddress: (address: Address) => void;
  setDeliveryLocation: (location: string) => void;
  hydrate: () => void;
}

// ──────────────────────────────────────────
//  Store
// ──────────────────────────────────────────

export const useLocationStore = create<LocationState>((set, get) => ({
  addresses: [],
  selectedAddress: null,
  deliveryLocation: '',

  setAddresses: (addresses: Address[]) => {
    set({ addresses });
    // Auto-select default address
    const defaultAddr = addresses.find((a) => a.is_default) ?? addresses[0] ?? null;
    if (defaultAddr && !get().selectedAddress) {
      set({ selectedAddress: defaultAddr, deliveryLocation: formatAddress(defaultAddr) });
      Storage.setObject(STORAGE_KEYS.SELECTED_ADDRESS, defaultAddr);
    }
  },

  addAddress: (address: Address) => {
    const addresses = [...get().addresses, address];
    if (address.is_default) {
      // Unset previous defaults
      addresses.forEach((a) => {
        if (a.id !== address.id) a.is_default = false;
      });
    }
    set({ addresses });
    if (address.is_default || addresses.length === 1) {
      set({ selectedAddress: address, deliveryLocation: formatAddress(address) });
      Storage.setObject(STORAGE_KEYS.SELECTED_ADDRESS, address);
    }
  },

  updateAddress: (id: number, updates: Partial<Address>) => {
    const addresses = get().addresses.map((a) =>
      a.id === id ? { ...a, ...updates } : a,
    );
    set({ addresses });
    const selected = get().selectedAddress;
    if (selected?.id === id) {
      const updated = { ...selected, ...updates };
      set({ selectedAddress: updated, deliveryLocation: formatAddress(updated) });
      Storage.setObject(STORAGE_KEYS.SELECTED_ADDRESS, updated);
    }
  },

  removeAddress: (id: number) => {
    const addresses = get().addresses.filter((a) => a.id !== id);
    set({ addresses });
    if (get().selectedAddress?.id === id) {
      const next = addresses[0] ?? null;
      set({
        selectedAddress: next,
        deliveryLocation: next ? formatAddress(next) : '',
      });
      if (next) Storage.setObject(STORAGE_KEYS.SELECTED_ADDRESS, next);
      else Storage.delete(STORAGE_KEYS.SELECTED_ADDRESS);
    }
  },

  selectAddress: (address: Address) => {
    set({ selectedAddress: address, deliveryLocation: formatAddress(address) });
    Storage.setObject(STORAGE_KEYS.SELECTED_ADDRESS, address);
  },

  setDeliveryLocation: (location: string) => {
    set({ deliveryLocation: location });
  },

  hydrate: () => {
    const saved = Storage.getObject<Address>(STORAGE_KEYS.SELECTED_ADDRESS);
    if (saved) {
      set({ selectedAddress: saved, deliveryLocation: formatAddress(saved) });
    }
  },
}));

// ──────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────

function formatAddress(address: Address): string {
  const parts = [
    address.address_line_1,
    address.address_line_2,
    address.city,
    address.state,
    address.postal_code,
  ].filter(Boolean);
  return parts.join(', ');
}

export default useLocationStore;
