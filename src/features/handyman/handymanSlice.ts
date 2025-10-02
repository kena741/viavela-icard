// Async thunk to fetch handymen by provider_id
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteHandyman, toggleHandymanStatus } from './addDeleteHandymanSlice';

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export const fetchHandymenByProviderId = createAsyncThunk(
  'handyman/fetchHandymenByProviderId',
  async (provider_id: string, thunkAPI) => {
    try {
            const { data, error } = await supabase
                .from('handyman')
                .select('*')
                .eq('provider_id', provider_id)
                .eq('isActive', true)
                .order('firstName', { ascending: true });
      if (error) throw error;
      return data as HandyManModel[];
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Failed to fetch handymen');
    }
  }
);

// Async thunk to fetch active handymen
export const fetchActiveHandymen = createAsyncThunk(
    'handyman/fetchActiveHandymen',
    async (_, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('handyman')
                .select('*')
                .eq('isActive', true);
            if (error) throw error;
            return data as HandyManModel[];
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to fetch handymen');
        }
    }
);
export const fetchHandymanById = createAsyncThunk(
    'handyman/fetchHandymanById',
    async (handymanId: string, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('handyman')
                .select('*')
                .eq('id', handymanId)
                .single();
            if (error) throw error;
            return data as HandyManModel;
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to fetch handyman');
        }
    }
);

// Async thunk to edit a handyman
export const editHandyman = createAsyncThunk(
  'handyman/editHandyman',
  async (
    { handyman, newPassword }: { handyman: HandyManModel; newPassword?: string },
    thunkAPI
  ) => {
    try {
      const updateData = { ...handyman };
      if (newPassword) {
        updateData.password = newPassword;
      }
      const { error } = await supabase
        .from('handyman')
        .update(updateData)
        .eq('id', handyman.id);
      if (error) throw error;
      return updateData as HandyManModel;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Failed to update handyman');
    }
  }
);
export interface HandyManModel {
    id: string;
    active: boolean;
    address: string;
    category: string;
    countryCode: string;
    createdAt: string; // ISO string or timestamp
    email: string;
    fcmToken: string;
    firstName: string;
    isActive: boolean;
    lastName: string;
    password: string;
    phoneNumber: string;
    profileImage: string;
    provider_id: string;
    subCategory: string;
    userName: string;
    userType: string;
    categoryId?: string;
    subCategoryId?: string;
}

export interface HandyManState {
    handymen: HandyManModel[];
    loading: boolean;
    error: string | null;
}

const initialState: HandyManState = {
    handymen: [],
    loading: false,
    error: null,
};

const handymanSlice = createSlice({
    name: 'handyman',
    initialState,
    reducers: {
        setHandymen(state, action: PayloadAction<HandyManModel[]>) {
            state.handymen = action.payload;
        },
        
        updateHandyman(state, action: PayloadAction<HandyManModel>) {
            const idx = state.handymen.findIndex(h => h.id === action.payload.id);
            if (idx !== -1) {
                state.handymen[idx] = action.payload;
            }
        },
        removeHandyman(state, action: PayloadAction<string>) {
            state.handymen = state.handymen.filter(h => h.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActiveHandymen.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveHandymen.fulfilled, (state, action) => {
                state.loading = false;
                state.handymen = action.payload;
            })
            .addCase(fetchActiveHandymen.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchHandymenByProviderId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHandymenByProviderId.fulfilled, (state, action) => {
                state.loading = false;
                state.handymen = action.payload;
            })
            .addCase(fetchHandymenByProviderId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteHandyman.fulfilled, (state, action) => {
                state.handymen = state.handymen.filter(h => h.id !== action.payload);
            })
            .addCase(editHandyman.fulfilled, (state, action) => {
                const idx = state.handymen.findIndex(h => h.id === action.payload.id);
                if (idx !== -1) {
                    state.handymen[idx] = action.payload;
                }
            })
            // Optimistically update isActive on toggleHandymanStatus
            .addCase(toggleHandymanStatus.fulfilled, (state, action) => {
                const idx = state.handymen.findIndex(h => h.id === action.payload.id);
                if (idx !== -1) {
                    state.handymen[idx].isActive = action.payload.isActive;
                }
            });
    },
});

export const { setHandymen, updateHandyman, removeHandyman } = handymanSlice.actions;
export default handymanSlice.reducer;


