
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import { updateService } from './editServiceSlice';

// Category and Subcategory types
export interface CategoryModel {
    id: string;
    categoryName: string;
    image?: string;
    active?: boolean | null;
    subcategories?: SubCategoryModel[];
}

export interface SubCategoryModel {
    id: string;
    subCategoryName: string;
    categoryId: string;
}



export interface ServiceModel {
    discountedPrice(discountedPrice: never): number | undefined;
    id: string;
    address?: string;
    categoryId?: string;
    categoryModel?: CategoryModel;
    createdAt?: string;
    description?: string;
    discount?: string;
    duration?: string;
    feature?: boolean;
    video?: string | null; // TikTok or other video URL
    likedUser?: string[];
    location?: {
        latitude: number;
        longitude: number;
    };
    position?: {
        geohash: string;
        geopoint: { latitude: number; longitude: number };
    };
    prePayment?: boolean;
    price?: string;
    provider_id?: string;
    reviewCount?: number | null;
    reviewSum?: number | null;
    serviceImage?: string[];
    serviceName?: string;
    slug?: string;
    status?: boolean;
    subCategoryId?: string;
    subCategoryModel?: SubCategoryModel;
    type?: string;
    serviceLocationMode?: string;
}


interface ServiceState {
    services: ServiceModel[];
    loading: boolean;
    error: string | null;
    categories: CategoryModel[];
    subcategories: SubCategoryModel[];
}

const initialState: ServiceState = {
    services: [],
    loading: false,
    error: null,
    categories: [],
    subcategories: [],
};

// Async thunk to fetch services for a customer (no categories/subcategories)
export const getCustomerServices = createAsyncThunk(
    'service/getCustomerServices',
    async (customer_id: string, thunkAPI) => {
        try {
            // Fetch services from Supabase, filter out archived
            const { data: services, error: serviceError } = await supabase
                .from('services')
                .select('*')
                .eq('customer_id', customer_id);
            console.log('Fetched services:', services, serviceError);
            if (serviceError) throw serviceError;

            return { services };
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to fetch services');
        }
    }
);

// Async thunk to fetch all services (no provider filter)
export const getAllServices = createAsyncThunk(
    'service/getAllServices',
    async (_, thunkAPI) => {
        try {
            // Fetch approved (status = true) services from Supabase, filter out archived
            const { data: services, error: serviceError } = await supabase
                .from('services')
                .select('*')
                .eq('approved', true)
                .eq('status', true)
                .neq('isArchived', true);
            if (serviceError) throw serviceError;

            return { services };
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to fetch services');
        }
    }
);



const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCustomerServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCustomerServices.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload)) {
                    // Backward compatibility: if payload is array, just set services
                    state.services = action.payload;
                } else {
                    state.services = action.payload.services;
                }
            })
            .addCase(getCustomerServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
        // Listen for editService/updateService.fulfilled to update the service in the list
        builder.addCase(updateService.fulfilled, (state, action) => {
            const updated = action.payload;
            if (!updated?.id) return;
            const idx = state.services.findIndex(s => s.id === updated.id);
            if (idx !== -1) {
                // Re-attach categoryModel as in getCustomerServices
                const categoriesWithSubs = state.categories.map(category => ({
                    ...category,
                    subcategories: state.subcategories.filter(sub => sub.categoryId === category.id)
                }));
                const currentCategory = categoriesWithSubs.find(cat => cat.id === updated.categoryId);
                state.services[idx] = {
                    ...state.services[idx],
                    ...updated,
                    categoryModel: currentCategory,
                };
            }
        });

        builder
            .addCase(getAllServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllServices.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload)) {
                    // Backward compatibility: if payload is array, just set services
                    state.services = action.payload as unknown as ServiceModel[];
                } else {
                    const payload = action.payload as unknown as { services: ServiceModel[] };
                    state.services = payload.services;
                }
            })
            .addCase(getAllServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default serviceSlice.reducer;