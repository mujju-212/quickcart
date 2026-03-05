import api, { ApiResponse } from './api';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface Address {
  id: number;
  user_id?: number;
  name?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: 'home' | 'work' | 'other';
  is_default: boolean;
  phone?: string;
}

export interface CreateAddressPayload {
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  address_type?: string;
}

export interface UpdateAddressPayload {
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  address_type?: string;
  is_default?: boolean;
}

// ──────────────────────────────────────────
//  Endpoints
// ──────────────────────────────────────────

export async function getAddresses(phone: string): Promise<Address[]> {
  const { data } = await api.get('/users/addresses', { params: { phone } });
  return data.addresses ?? data;
}

export async function addAddress(payload: CreateAddressPayload): Promise<ApiResponse<Address>> {
  const { data } = await api.post('/users/addresses', payload);
  return data;
}

export async function updateAddress(
  addressId: number,
  payload: UpdateAddressPayload,
): Promise<ApiResponse<Address>> {
  const { data } = await api.put(`/users/addresses/${addressId}`, payload);
  return data;
}

export async function deleteAddress(addressId: number): Promise<ApiResponse> {
  const { data } = await api.delete(`/users/addresses/${addressId}`);
  return data;
}

const addressService = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};

export default addressService;
