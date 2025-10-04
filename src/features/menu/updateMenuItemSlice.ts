import { createSlice as createModalSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import { uploadFilesToSupabase } from '../uploadFilesToSupabase';

export interface UpdateMenuItemModel {
    id: string;
    customer_id: string;
    name?: string;
    description?: string;
    price?: number | string;
    discount_percent?: number;
    image_url?: string;
    category?: string;
    is_available?: boolean;
}

export const updateMenuItem = createAsyncThunk(
    'menu/updateMenuItem',
    async (
        args: { item: UpdateMenuItemModel; imageFiles?: File[] },
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
            const itemToUpdate = {
                ...args.item,
                image_url: imageUrl,
            };
            // Remove id from update fields
            const { id, ...fieldsToUpdate } = itemToUpdate;
            // Update Supabase 'menu_items' table
            const { error } = await supabase
                .from('menu_items')
                .update(fieldsToUpdate)
                .eq('id', id);
            if (error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return { ...itemToUpdate };
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to update menu item');
        }
    }
);

interface UpdateMenuItemModalState {
    open: boolean;
    loading: boolean;
    error: string | null;
    item: UpdateMenuItemModel | null;
}

const initialUpdateMenuItemModalState: UpdateMenuItemModalState = {
    open: false,
    loading: false,
    error: null,
    item: null,
};

const updateMenuItemModalSlice = createModalSlice({
    name: 'updateMenuItemModal',
    initialState: initialUpdateMenuItemModalState,
    reducers: {
        openUpdateMenuItemModal(state, action) {
            state.open = true;
            state.error = null;
            state.item = action.payload;
        },
        closeUpdateMenuItemModal(state) {
            state.open = false;
            state.loading = false;
            state.error = null;
            state.item = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMenuItem.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.open = false; // Close the modal on success
                state.item = null;
            })
            .addCase(updateMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to update menu item';
            });
    },
});

export const { openUpdateMenuItemModal, closeUpdateMenuItemModal } = updateMenuItemModalSlice.actions;
export const updateMenuItemModalSliceReducer = updateMenuItemModalSlice.reducer;

// Selectors for loading, error, and item state
import type { RootState } from '@/store/store';
export const selectUpdateMenuItemLoading = (state: RootState) => (state as RootState & { updateMenuItemModal?: { loading: boolean } }).updateMenuItemModal?.loading ?? false;
export const selectUpdateMenuItemError = (state: RootState) => (state as RootState & { updateMenuItemModal?: { error: string | null } }).updateMenuItemModal?.error ?? null;
export const selectUpdateMenuItemItem = (state: RootState) => (state as RootState & { updateMenuItemModal?: { item: UpdateMenuItemModel | null } }).updateMenuItemModal?.item ?? null;
