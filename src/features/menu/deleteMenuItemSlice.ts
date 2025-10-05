import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';

export const deleteMenuItem = createAsyncThunk(
    'menu/deleteMenuItem',
    async (id: string, thunkAPI) => {
        try {
            const { error } = await supabase
                .from('menu_items')
                .delete()
                .eq('id', id);
            if (error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return id;
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to delete menu item');
        }
    }
);

interface DeleteMenuItemState {
    loading: boolean;
    error: string | null;
}

const initialState: DeleteMenuItemState = {
    loading: false,
    error: null,
};

const deleteMenuItemSlice = createSlice({
    name: 'deleteMenuItem',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMenuItem.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to delete menu item';
            });
    },
});

export const deleteMenuItemReducer = deleteMenuItemSlice.reducer;
