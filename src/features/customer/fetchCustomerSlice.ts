import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/supabaseClient';
import type { UserModel } from '@/features/auth/loginSlice';

interface ProviderState {
  profile: UserModel | null;
  loading: boolean;
  error?: string | null;
}

const initialState: ProviderState = {
  profile: null,
  loading: false,
  error: null,
};

export const getCustomerDetail = createAsyncThunk(
  'provider/getCustomerDetail',
  async (userId: string, thunkAPI) => {
    try {
      const { data, error } = await supabase.from('customers').select('*').eq('id', userId).single();
      if (error) throw error;
      // Normalize createdAt if needed
      if (data && data.createdAt && typeof data.createdAt !== 'string') {
        data.createdAt = new Date(data.createdAt).toISOString();
      }
      return data as UserModel;
    } catch (err) {
      if (err instanceof Error) return thunkAPI.rejectWithValue(err.message);
      return thunkAPI.rejectWithValue('Failed to fetch customers details');
    }
  }
);

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getCustomerDetail.rejected, (state, action) => {
        state.loading = false;
        state.profile = null;
        state.error = action.payload as string || 'Failed to fetch customer';
      });
  },
});

export default providerSlice.reducer;
