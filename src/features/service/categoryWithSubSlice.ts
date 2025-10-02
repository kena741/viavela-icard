import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import type { CategoryModel, SubCategoryModel } from './serviceSlice';

interface CategoryWithSubs extends CategoryModel {
  subcategories: SubCategoryModel[];
}

interface CategoryWithSubsState {
  categories: CategoryWithSubs[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryWithSubsState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategoriesWithSubs = createAsyncThunk(
  'categoryWithSubs/fetchCategoriesWithSubs',
  async (_, thunkAPI) => {
    try {
      // Fetch categories from Supabase
      const { data: categories, error: catError } = await supabase.from('category').select('*');
      console.log('Fetched categories:', catError);
      if (catError) throw catError;
      // Fetch subcategories from Supabase
      const { data: subcategories, error: subError } = await supabase.from('sub_category').select('*');
      if (subError) throw subError;
      // Combine categories and subcategories
      const categoriesWithSubs: CategoryWithSubs[] = (categories || []).map(category => ({
        ...category,
        subcategories: (subcategories || []).filter(sub => sub.categoryId === category.id)
      }));
      return categoriesWithSubs;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Failed to fetch categories with subcategories');
    }
  }
);

const categoryWithSubSlice = createSlice({
  name: 'categoryWithSubs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesWithSubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesWithSubs.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchCategoriesWithSubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categoryWithSubSlice.reducer;
