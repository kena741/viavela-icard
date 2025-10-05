// addDeleteCustomerSlice.tsx
import { createSlice as createModalSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCustomersByProviderId } from './customerSlice';
import { supabase } from '@/supabaseClient';

interface AddCustomerModalState {
    open: boolean;
    loading: boolean;
    error: string | null;
}

const initialAddCustomerModalState: AddCustomerModalState = {
    open: false,
    loading: false,
    error: null,
};

export interface AddCustomerInput {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    provider_id: string;
    countryCode: string;
    address?: string;
    id?: string;
}

// Delete customer thunk
export const deleteCustomer = createAsyncThunk(
    'customer/deleteCustomer',
    async (customerId: string, thunkAPI) => {
        try {
            const { error } = await supabase
                .from('customer')
                .delete()
                .eq('id', customerId);
            if (error) throw error;
            return customerId;
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to delete customer');
        }
    }
);

// Add customer thunk
export const addCustomer = createAsyncThunk(
    'customer/addCustomer',
    async (customer: AddCustomerInput, thunkAPI) => {
        try {
            const response = await fetch('/api/createCustomer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customer),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to add customer');

            if (customer.provider_id) {
                await thunkAPI.dispatch(fetchCustomersByProviderId(customer.provider_id));
            }

            return customer;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message || 'Failed to add customer');
            }
            return thunkAPI.rejectWithValue('Failed to add customer');
        }
    }
);

// Toggle customer active status thunk
export const toggleCustomerStatus = createAsyncThunk(
    'customer/toggleCustomerStatus',
    async ({ id, isActive }: { id: string; isActive: boolean }, thunkAPI) => {
        try {
            const { error } = await supabase
                .from('customer')
                .update({ isActive })
                .eq('id', id);
            if (error) throw error;
            return { id, isActive };
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to update customer status');
        }
    }
);

// Update customer document fields thunk
export const updateCustomerDoc = createAsyncThunk(
    'customer/updateCustomerDoc',
    async ({ id, updates }: { id: string; updates: Partial<AddCustomerInput> }, thunkAPI) => {
        try {
            const { error } = await supabase
                .from('customer')
                .update(updates)
                .eq('id', id);
            if (error) throw error;
            return { id, updates };
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to update customer document');
        }
    }
);

const addCustomerModalSlice = createModalSlice({
    name: 'addCustomerModal',
    initialState: initialAddCustomerModalState,
    reducers: {
        openAddCustomerModal(state) {
            state.open = true;
            state.error = null;
        },
        closeAddCustomerModal(state) {
            state.open = false;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(toggleCustomerStatus.fulfilled, () => { })
            .addCase(addCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCustomer.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(addCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to add customer';
            });
    },
});

export const { openAddCustomerModal, closeAddCustomerModal } = addCustomerModalSlice.actions;
export const addCustomerModalSliceReducer = addCustomerModalSlice.reducer;
