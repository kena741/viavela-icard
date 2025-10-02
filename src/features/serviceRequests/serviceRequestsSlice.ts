import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import { ServiceRequest } from './types';

interface ServiceRequestsState {
  items: ServiceRequest[];
  loading: boolean;
}

const initialState: ServiceRequestsState = {
  items: [],
  loading: false,
};

// Thunk to accept a pending service request (Supabase)
export const acceptServiceRequest = createAsyncThunk<
  void,
  string
>(
  'serviceRequests/acceptServiceRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('booked_service')
        .update({ status: 'accepted' })
        .eq('id', requestId);
      if (error) throw error;
    } catch {
      return rejectWithValue('Failed to accept request');
    }
  }
);

// Thunk to fetch pending service requests (Supabase)
export const startPendingServiceRequestsListener = createAsyncThunk<
  void,
  string
>(
  'serviceRequests/startPendingServiceRequestsListener',
  async (provider_id, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const { data, error } = await supabase
        .from('booked_service')
        .select('*')
        .eq('provider_id', provider_id)
        .eq('status', 'pending');

      if (error) throw error;

  const requests: ServiceRequest[] = (data || []).map((d: Record<string, unknown>) => {
        const svc = (d.serviceDetails ?? {}) as {
          categoryModel?: { categoryName?: string };
          subCategoryModel?: { subCategoryName?: string };
          startTime?: string;
          address?: string;
          serviceName?: string;
          price?: number;
          description?: string;
        };
        const cat = svc.categoryModel ?? {};
        const sub = svc.subCategoryModel ?? {};
        return {
          id: d.id,
          bookingDate: d.bookingDate,
          createdAt: d.createdAt,
          scheduledFor: svc.startTime !== undefined
            ? { toDate: () => new Date(svc.startTime as string) }
            : d.createdAt,
          customerId: d.customerId,
          firstName: d.firstName,
          lastName: d.lastName,
          phoneNumber: d.phoneNumber,
          email: d.email,
          address: svc.address,
          categoryName: cat.categoryName,
          subCategoryName: sub.subCategoryName,
          serviceName: svc.serviceName,
          quantity: d.quantity,
          price: svc.price ?? d.price,
          discount: d.discount,
          totalAmount: d.totalAmount,
          description: svc.description ?? d.description,
          notes: d.notes,
          paymentCompleted: d.paymentCompleted,
          status: d.status,
        } as ServiceRequest;
      });
      dispatch(setRequests(requests));
    } catch {
      // Optionally handle error
      dispatch(setRequests([]));
    }
    dispatch(setLoading(false));
  }
);

const serviceRequestsSlice = createSlice({
  name: 'serviceRequests',
  initialState,
  reducers: {
    setRequests(state, action: PayloadAction<ServiceRequest[]>) {
      state.items = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setRequests, setLoading } = serviceRequestsSlice.actions;
export default serviceRequestsSlice.reducer;
