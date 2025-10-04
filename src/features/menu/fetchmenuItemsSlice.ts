import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';

export interface MenuItem {
    id?: string;
    customer_id: string;
    name: string;
    description?: string;
    price: number | string;
    discount_percent?: number;
    image_url?: string;
    category?: string;
    is_available?: boolean;
    created_at?: string;
}

export const fetchMenuItems = createAsyncThunk(
    'menuItems/fetchMenuItems',
    async (customer_id: string, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .eq('customer_id', customer_id)
                .order('created_at', { ascending: false });
            if (error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return data;
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to fetch menu items');
        }
    }
);

interface MenuItemsState {
    items: MenuItem[];
    loading: boolean;
    error: string | null;
}

const initialState: MenuItemsState = {
    items: [],
    loading: false,
    error: null,
};

const menuItemsSlice = createSlice({
    name: 'menuItems',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenuItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenuItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
            })
            .addCase(fetchMenuItems.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to fetch menu items';
            });
    },
});

export const menuItemsReducer = menuItemsSlice.reducer;
