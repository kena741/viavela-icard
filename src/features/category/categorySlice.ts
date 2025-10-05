import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';

export interface CategoryLang {
    name: string;
    description: string;
    image: string;
}

export interface Category {
    id?: string;
    en: CategoryLang;
    am: CategoryLang;
}

interface CategoryRow {
    id?: string;
    en: string | CategoryLang;
    am: string | CategoryLang;
}

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async (_, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('category')
                .select('*');
            if (error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            // Parse JSON fields for en and am
            const categories = (data as CategoryRow[] || []).map((cat) => ({
                id: cat.id,
                en: typeof cat.en === 'string' ? JSON.parse(cat.en) : cat.en,
                am: typeof cat.am === 'string' ? JSON.parse(cat.am) : cat.am,
            }));
            return categories;
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to fetch categories');
        }
    }
);

interface CategoryState {
    items: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    items: [],
    loading: false,
    error: null,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to fetch categories';
            });
    },
});

export const categoryReducer = categorySlice.reducer;
