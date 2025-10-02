import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '@/supabaseClient';
import type { RequestsState } from './requestsSlice';

export interface CustomerAddress {
  address: string;
  addressAs: string;
  id: string;
  isDefault: boolean;
  landmark: string;
  locality: string;
  location: {
    latitude: number;
    longitude: number;
  };
  name: string;
}

export interface CustomerModel {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  profilePic: string;
  createdAt: Date | string;
  loginType: string;
  password: string;
  fcmToken: string;
  walletAmount: string;
  slug: string;
  customerAddresses: CustomerAddress[];
}

interface RequestDetailState {
  detail: (RequestsState & { customer?: CustomerModel }) | null;
  loading: boolean;
  error: string | null;
}

const initialState: RequestDetailState = {
  detail: null,
  loading: false,
  error: null,
};


export const fetchBookedServiceDetail = createAsyncThunk(
  'bookedService/fetchBookedServiceDetail',
  async (id: string, thunkAPI) => {
    try {
      const { data: bookedService, error: bsError } = await supabase
        .from('booked_service')
        .select('*')
        .eq('id', id)
        .single();

      if (bsError || !bookedService) {
        throw new Error(bsError?.message || 'Booked service not found');
      }

      let customer: CustomerModel | undefined;

      if (bookedService.customerId) {
        const { data: customerData, error: cError } = await supabase
          .from('users')
          .select('*, customerAddresses:customer_addresses(*)')
          .eq('id', bookedService.customerId)
          .single();

        if (!cError && customerData) {
          customer = customerData as CustomerModel;
        }
      }

      return { ...bookedService, customer };
    } catch (error: unknown) {
      let errorMessage = 'Failed to fetch service detail';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const requestDetailServiceSlice = createSlice({
  name: 'requestDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookedServiceDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.detail = null;
      })
      .addCase(fetchBookedServiceDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
        state.error = null;
      })
      .addCase(fetchBookedServiceDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.detail = null;
      });
  },
});

export default requestDetailServiceSlice.reducer;
