import { createSlice as createModalSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import { uploadFilesToSupabase } from '../uploadFilesToSupabase';



export interface AddMenuItemModel {
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

export const addMenuItem = createAsyncThunk(
    'menu/addMenuItem',
    async (
        args: { item: AddMenuItemModel; imageFiles?: File[] },
        thunkAPI
    ) => {
        try {
            let imageUrl: string | undefined = args.item.image_url;
            // If imageFiles are provided, upload them to Supabase Storage
            if (args.imageFiles && args.imageFiles.length > 0 && args.item.customer_id) {
                const uploaded = await uploadFilesToSupabase(
                    args.imageFiles,
                    `public/menu/${args.item.customer_id}`
                );
                imageUrl = uploaded[0]; // Only use the first image for image_url
            }
            const itemToSave = {
                ...args.item,
                image_url: imageUrl,
            };
            // Insert into Supabase 'menu_items' table
            const { error } = await supabase.from('menu_items').insert([itemToSave]);
            if (error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return { ...itemToSave };
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to add menu item');
        }
    }
);

interface AddMenuItemModalState {
    open: boolean;
    loading: boolean;
    error: string | null;
}

const initialAddMenuItemModalState: AddMenuItemModalState = {
    open: false,
    loading: false,
    error: null,
};

const addMenuItemModalSlice = createModalSlice({
    name: 'addMenuItemModal',
    initialState: initialAddMenuItemModalState,
    reducers: {
        openAddMenuItemModal(state) {
            state.open = true;
            state.error = null;
        },
        closeAddMenuItemModal(state) {
            state.open = false;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMenuItem.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.open = false; // Close the modal on success
            })
            .addCase(addMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to add menu item';
            });
    },
});

export const { openAddMenuItemModal, closeAddMenuItemModal } = addMenuItemModalSlice.actions;
export const addMenuItemModalSliceReducer = addMenuItemModalSlice.reducer;

// Selectors for loading and error state
import type { RootState } from '@/store/store';
export const selectAddMenuItemLoading = (state: RootState) => (state as RootState & { addMenuItemModal?: { loading: boolean } }).addMenuItemModal?.loading ?? false;
export const selectAddMenuItemError = (state: RootState) => (state as RootState & { addMenuItemModal?: { error: string | null } }).addMenuItemModal?.error ?? null;
