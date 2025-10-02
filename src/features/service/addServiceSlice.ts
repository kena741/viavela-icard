import { createSlice as createModalSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import { uploadFilesToSupabase } from '../uploadFilesToSupabase';


export interface AddServiceModel {
    service_name: string;
    description: string;
    address?: string;
    price: number | string;
    discount?: string;
    customer_id: string;
    service_image?: string[];
    video?: string; // TikTok or other video URL
    created_at?: Date;
    duration?: string;
    pre_payment?: boolean;
    liked_user?: string[] | null;
    review_count: number | null;
    review_sum: number | null;
    feature: boolean;
    status?: boolean;
    active: boolean | null;
    slug?: string;
    type: string;
    service_location_mode: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    position?: {
        geohash: string;
        geopoint: { latitude: number; longitude: number };
    };
}

export const addService = createAsyncThunk(
    'service/addService',
    async (
        args: { service: AddServiceModel; imageFiles?: File[]; videoFile?: File },
        thunkAPI
    ) => {
        try {
            let imageUrls: string[] = args.service.service_image || [];
            // If imageFiles are provided, upload them to Supabase Storage
            if (args.imageFiles && args.imageFiles.length > 0 && args.service.customer_id) {
                imageUrls = await uploadFilesToSupabase(
                    args.imageFiles,
                    `public/${args.service.customer_id}`
                );
            }
            // If a videoFile is provided, upload it and set service.video to the URL
            let videoUrl: string | null = null;
            if (args.videoFile && args.service.customer_id) {
                const uploaded = await uploadFilesToSupabase([args.videoFile], `public/${args.service.customer_id}/videos`);
                videoUrl = uploaded[0] || null;
            }
            const serviceToSave = {
                ...args.service,
                service_image: imageUrls,
                video: videoUrl,
            };
            // Insert into Supabase 'service' table
            const { error } = await supabase.from('services').insert([serviceToSave]);
            console.log('Service error:', error);
            if (error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return { ...serviceToSave };
        } catch (error) {
            console.error('Error adding service:', error);
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Failed to add service');
        }
    }
);

interface AddServiceModalState {
    open: boolean;
    loading: boolean;
    error: string | null;
}

const initialAddServiceModalState: AddServiceModalState = {
    open: false,
    loading: false,
    error: null,
};

const addServiceModalSlice = createModalSlice({
    name: 'addServiceModal',
    initialState: initialAddServiceModalState,
    reducers: {
        openAddServiceModal(state) {
            state.open = true;
            state.error = null;
        },
        closeAddServiceModal(state) {
            state.open = false;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addService.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.open = false; // Close the modal on success
            })
            .addCase(addService.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to add service';
            });
    },
});

export const { openAddServiceModal, closeAddServiceModal } = addServiceModalSlice.actions;
export const addServiceModalSliceReducer = addServiceModalSlice.reducer;
