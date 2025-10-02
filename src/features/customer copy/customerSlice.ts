import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/supabaseClient';

export interface CustomerDetail {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address?: Address;
    postal_code?: string;
    country_code?: string;
    provider_id?: string;
    created_at?: string;
    [key: string]: unknown;
}

export interface Address {
    city?: string;
    state?: string; // state or province
    country?: string;
    postal_code?: string;
}

interface CustomerDetailState {
    customer: CustomerDetail | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: CustomerDetailState = {
    customer: null,
    loading: false,
    error: null,
    success: false,
};

// Fetch a single customer by id (customer table)
export const fetchCustomerById = createAsyncThunk<CustomerDetail, string>(
    'customer/fetchById',
    async (id: string, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('customer')
                .select('*')
                .eq('user_id', id)
                .single();
            console.log('Fetched customer:', data);
            if (error) throw error;
            return data as CustomerDetail;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to fetch customer';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update a customer by user_id in the customer table
export const updateCustomer = createAsyncThunk<
    CustomerDetail,
    { id: string; changes: Partial<CustomerDetail> }
>(
    'customer/update',
    async ({ id, changes }, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('customer')
                .update(changes)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data as CustomerDetail;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to update customer';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const customerDetailSlice = createSlice({
    name: 'customerDetail',
    initialState,
    reducers: {
        setCustomer(state, action: PayloadAction<CustomerDetail | null>) {
            state.customer = action.payload;
        },
        resetCustomer(state) {
            state.customer = null;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch customer
            .addCase(fetchCustomerById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchCustomerById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.customer = action.payload;
            })
            .addCase(fetchCustomerById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = (action.payload as string) || 'Failed to fetch customer';
            })
            // Update customer
            .addCase(updateCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // Replace or merge the current customer
                state.customer = { ...(state.customer || {}), ...(action.payload || {}) } as CustomerDetail;
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = (action.payload as string) || 'Failed to update customer';
            });
    },
});

export const { setCustomer, resetCustomer } = customerDetailSlice.actions;
export default customerDetailSlice.reducer;
