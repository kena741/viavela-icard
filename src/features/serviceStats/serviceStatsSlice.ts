// src/features/serviceStats/serviceStatsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/supabaseClient';
import { TopService } from './types';

interface ServiceStatsState {
  items: TopService[];
  loading: boolean;
}

const initialState: ServiceStatsState = {
  items: [],
  loading: false,
};

interface RawBooking {
  serviceName: string;
  revenue: number;
}

export const fetchTopRequestedServices = createAsyncThunk<
  TopService[],
  string
>('serviceStats/fetchTopRequestedServices', async (provider_id) => {
  try {
    const { data, error } = await supabase
      .from('booked_service')
      .select('serviceName, totalAmount, quantity, price')
      .eq('provider_id', provider_id)
      .in('status', ['accepted', 'completed']);

    if (error) {
      console.error('[Supabase] fetchTopRequestedServices error:', error);
      throw error;
    }

  const raw: RawBooking[] = (data || []).map((d: Record<string, unknown>) => {
      const name = typeof d.serviceName === 'string' && d.serviceName.length > 0
        ? d.serviceName
        : 'Unknown Service';
      const amount = parseFloat(String(d.totalAmount ?? ''));
      const fallbackRevenue =
        (parseInt(String(d.quantity || '0'), 10) || 0) *
        (parseFloat(String(d.price || '0')) || 0);

      return {
        serviceName: name,
        revenue: !isNaN(amount) ? amount : fallbackRevenue,
      };
    });

    const grouped: Record<string, { count: number; revenue: number }> = {};

    raw.forEach(({ serviceName, revenue }) => {
      if (!grouped[serviceName]) grouped[serviceName] = { count: 0, revenue: 0 };
      grouped[serviceName].count++;
      grouped[serviceName].revenue += revenue;
    });

    const TOP_N = 3;
    const result: TopService[] = Object.entries(grouped)
      .map(([serviceName, { count, revenue }]) => ({
        serviceName,
        count,
        revenue,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_N);

    return result;
  } catch (err) {
    console.error('Failed to fetch top services:', err);
    throw err;
  }
});

const serviceStatsSlice = createSlice({
  name: 'serviceStats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopRequestedServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopRequestedServices.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTopRequestedServices.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default serviceStatsSlice.reducer;
