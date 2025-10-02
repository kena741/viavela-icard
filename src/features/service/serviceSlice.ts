
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import { updateService } from './editServiceSlice';




export interface ServiceModel {
    discountedPrice(discountedPrice: never): number | undefined;
    id: string;
    address?: string;
    created_at?: string;
    description?: string;
    discount?: string;
    duration?: string;
    feature?: boolean;
    video?: string | null;
    liked_user?: string[];
    location?: {
        latitude: number;
        longitude: number;
    };
    position?: {
        geohash: string;
        geopoint: { latitude: number; longitude: number };
    };
    pre_payment?: boolean;
    price?: string;
    customer_id?: string;
    review_count?: number | null;
    review_sum?: number | null;
    service_image?: string[];
    service_name?: string;
    slug?: string;
    status?: boolean;
    type?: string;
    service_location_mode?: string;
    // category and subcategory removed
}


interface ServiceState {
    services: ServiceModel[];
    loading: boolean;
    error: string | null;
}

const initialState: ServiceState = {
    services: [],
    loading: false,
    error: null,
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
                state.services[idx] = {
                    ...state.services[idx],
                    ...updated,
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