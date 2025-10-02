import { createSlice as createModalSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHandymenByProviderId } from './handymanSlice';
import { supabase } from '@/supabaseClient';


interface AddHandymanModalState {
    open: boolean;
    loading: boolean;
    error: string | null;
}

const initialAddHandymanModalState: AddHandymanModalState = {
    open: false,
    loading: false,
    error: null,
};

export interface AddHandymanInput {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    provider_id: string;
    password: string;
    category: string;
    countryCode: string;
    subCategory?: string;
    profileImage?: string;
    address?: string;
    id?: string;
    categoryId?: string;
    subCategoryId?: string;
}
// Delete handyman thunk
export const deleteHandyman = createAsyncThunk(
    'handyman/deleteHandyman',
    async (handymanId: string, thunkAPI) => {
        try {
            const { error } = await supabase
                .from('handyman')
                .delete()
                .eq('id', handymanId);
            console.error('Response from deleteHandyman API:', error);
            if (error) throw error;
            return handymanId;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error deleting handyman:', error.message);
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to delete handyman');
        }
    }
);

export const addHandyman = createAsyncThunk(
    'handyman/addHandyman',
    async (handyman: AddHandymanInput, thunkAPI) => {
        try {
            // 1. Create Auth user and get UID from API
            const response = await fetch('/api/createHandyman', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(handyman),
            });
            console.log('Response from createHandyman API:', response);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to add handyman');

            // 2. Refetch handymen by provider_id after successful add
            if (handyman.provider_id) {
                // Use dynamic import to avoid circular dependency
                await thunkAPI.dispatch(fetchHandymenByProviderId(handyman.provider_id));
            }

            return handyman;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error adding handyman:', error);
                return thunkAPI.rejectWithValue(error.message || 'Failed to add handyman');
            }
            return thunkAPI.rejectWithValue('Failed to add handyman');
        }
    }
);


// Thunk to toggle handyman isActive status only
export const toggleHandymanStatus = createAsyncThunk(
    'handyman/toggleHandymanStatus',
    async (
        { id, isActive }: { id: string; isActive: boolean },
        thunkAPI
    ) => {
        try {
            const { error } = await supabase
                .from('handyman')
                .update({ isActive })
                .eq('id', id);
            if (error) throw error;
            return { id, isActive };
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to update handyman status');
        }
    }
);

// Thunk to update any handyman document fields
export const updateHandymanDoc = createAsyncThunk(
    'handyman/updateHandymanDoc',
    async (
        { id, updates }: { id: string; updates: Partial<AddHandymanInput> },
        thunkAPI
    ) => {
        try {
            const { error } = await supabase
                .from('handyman')
                .update(updates)
                .eq('id', id);
            if (error) throw error;
            return { id, updates };
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to update handyman document');
        }
    }
);

const addHandymanModalSlice = createModalSlice({
    name: 'addHandymanModal',
    initialState: initialAddHandymanModalState,
    reducers: {
        openAddHandymanModal(state) {
            state.open = true;
            state.error = null;
        },
        closeAddHandymanModal(state) {
            state.open = false;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(toggleHandymanStatus.fulfilled, () => {
            })
            .addCase(addHandyman.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addHandyman.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(addHandyman.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to add handyman';
            });
    },
});



export const { openAddHandymanModal, closeAddHandymanModal } = addHandymanModalSlice.actions;
export const addHandymanModalSliceReducer = addHandymanModalSlice.reducer;