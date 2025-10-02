import { HandyManModel } from './../handyman/handymanSlice';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';


// Types for nested objects
export interface AdminCommission {
    active: boolean;
    isFix: boolean;
    value: string;
}

export interface BookingAddress {
    address: string;
    addressAs: string;
    id: string;
    isDefault: boolean;
    landmark: string;
    locality: string;
    location: {
        latitude: number;
        longitude: number;
    };
    name: string;
}

export interface Coupon {
    active: boolean | null;
    amount: string;
    code: string | null;
    expireAt: string | null;
    id: string | null;
    isFix: boolean | null;
    isPrivate: boolean | null;
    minAmount: string | null;
    title: string | null;
}

export interface ExtraChargeModel {
    chargeDetail: string;
    extraCharge: string;
    id: string;
}

export interface HoldTime {
    id: string;
}

export interface CategoryModel {
    active: boolean | null;
    categoryName: string;
    id: string;
    image: string;
}

export interface SubCategoryModel {
    categoryId: string;
    id: string;
    subCategoryName: string;
}

export interface ServiceDetails {
    address: string;
    categoryId: string;
    categoryModel: CategoryModel;
    description: string;
    discount: string;
    duration: string;
    feature: boolean;
    id: string;
    likedUser: string[];
    location: {
        latitude: number;
        longitude: number;
    };
    position: {
        geohash: string;
        geopoint: { latitude: number; longitude: number };
    };
    prePayment: boolean;
    price: string;
    provider_id: string;
    reviewCount: string;
    reviewSum: string;
    serviceImage: string[];
    serviceName: string;
    slug: string;
    status: boolean;
    subCategoryId: string;
    subCategoryModel: SubCategoryModel;
    type: string;
}

export interface RequestsState {
    adminCommission: AdminCommission;
    bookingAddress: BookingAddress;
    bookingDate?: Date;
    coupon: Coupon;
    createdAt: Date;
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    handyman?: HandyManModel
    description: string;
    discount: string;
    endTime: string | null;
    extraChargeAmount: string;
    extraChargeGst: boolean;
    extraChargeModel: ExtraChargeModel;
    taxList: string[];
    handymanId: string | null;
    holdTime: HoldTime[];
    id: string;
    otp: string;
    paymentCompleted: boolean;
    paymentType: string;
    postJob: boolean;
    prePaymentExtraChargePayment: boolean;
    provider_id: string;
    providerMySelf: boolean;
    quantity: string;
    reason: string | null;
    serviceDetails: ServiceDetails;
    startTime: string;
    status: string;
    subTotal: string;
    taxList2: string[];
    totalAmount: string;
    price: string;
    serviceName: string;
    handyman_id: string;
    serviceImage?: string;
}


interface RequestsSliceState {
    requests: RequestsState[];
    loading: boolean;
    error: string | null;
    singleRequest: RequestsState | null;
}


const initialState: RequestsSliceState = {
    requests: [],
    loading: false,
    error: null,
    singleRequest: null,
};




// Supabase: Fetch all requests for a provider
export const fetchAllRequests = createAsyncThunk(
    'requests/fetchAll',
    async (provider_id: string, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('booked_service')
                .select('*')
                .eq('provider_id', provider_id);
            if (error) throw error;
            return data || [];
        } catch {
            return thunkAPI.rejectWithValue('Failed to fetch all requests');
        }
    }
);

// Supabase: Fetch all requests for a customer
// Assumption: the booked_service table stores the customer foreign key as `customer_id`.
export const fetchAllCustomerRequests = createAsyncThunk(
    'requests/fetchAllCustomer',
    async (customer_id: string, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('booked_service')
                .select('*')
                .eq('customer_id', customer_id);
            if (error) throw error;
            return data || [];
        } catch {
            return thunkAPI.rejectWithValue('Failed to fetch customer requests');
        }
    }
);

// Supabase: Fetch requests by status
export const fetchRequestsByStatus = createAsyncThunk(
    'requests/fetchByStatus',
    async ({ provider_id, status }: { provider_id: string; status: string }, thunkAPI) => {
        try {
            let data = [];
            if (status === 'completed') {
                // Fetch both 'completed' and 'pending_approval'
                const { data: completed, error: error1 } = await supabase
                    .from('booked_service')
                    .select('*')
                    .eq('provider_id', provider_id)
                    .eq('status', 'completed');
                const { data: pending, error: error2 } = await supabase
                    .from('booked_service')
                    .select('*')
                    .eq('provider_id', provider_id)
                    .eq('status', 'pending_approval');
                if (error1 || error2) throw error1 || error2;
                data = [...(pending || []), ...(completed || [])];
            } else {
                const { data: statusData, error } = await supabase
                    .from('booked_service')
                    .select('*')
                    .eq('provider_id', provider_id)
                    .eq('status', status);
                if (error) throw error;
                data = statusData || [];
            }
            return data;
        } catch {
            return thunkAPI.rejectWithValue(`Failed to fetch ${status} requests`);
        }
    }
);

// Supabase: Fetch booked services by handyman_id
export const fetchBookedServicesByHandyman = createAsyncThunk(
    'requests/fetchByHandyman',
    async (handyman_id: string, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('booked_service')
                .select('*')
                .eq('handyman_id', handyman_id);
            if (error) throw error;
            return data || [];
        } catch {
            return thunkAPI.rejectWithValue('Failed to fetch requests for handyman');
        }
    }
);

// Supabase: Fetch requests by status for a customer
export const fetchCustomerRequestsByStatus = createAsyncThunk(
    'requests/fetchCustomerByStatus',
    async ({ customer_id, status }: { customer_id: string; status: string }, thunkAPI) => {
        try {
            let data: RequestsState[] = [];
            if (status === 'completed') {
                // Fetch both 'completed' and 'pending_approval' for customers as well
                const { data: completed, error: error1 } = await supabase
                    .from('booked_service')
                    .select('*')
                    .eq('customer_id', customer_id)
                    .eq('status', 'completed');
                const { data: pending, error: error2 } = await supabase
                    .from('booked_service')
                    .select('*')
                    .eq('customer_id', customer_id)
                    .eq('status', 'pending_approval');
                if (error1 || error2) throw error1 || error2;
                data = [...(pending || []), ...(completed || [])];
            } else {
                const { data: statusData, error } = await supabase
                    .from('booked_service')
                    .select('*')
                    .eq('customer_id', customer_id)
                    .eq('status', status);
                if (error) throw error;
                data = statusData || [];
            }
            return data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : `Failed to fetch ${status} requests for customer`;
            return thunkAPI.rejectWithValue(message);
        }
    }
);


// Supabase: Update request status if paid
export const updateRequestStatusIfPaid = createAsyncThunk(
    'requests/updateStatusIfPaid',
    async ({ id, newStatus }: { id: string; newStatus: string }, thunkAPI) => {
        try {
            // Fetch the request
            const { data, error } = await supabase
                .from('booked_service')
                .select('id, paymentCompleted')
                .eq('id', id)
                .single();
            if (error || !data) throw new Error('Request not found');
            if (!data.paymentCompleted) throw new Error('Payment not completed');
            // Update status
            const { error: updateError } = await supabase
                .from('booked_service')
                .update({ status: newStatus })
                .eq('id', id);
            if (updateError) throw updateError;
            return { id, newStatus };
        } catch (error) {
            let message = 'Failed to update request status';
            if (error instanceof Error) message = error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Supabase: Change the status of a request (e.g., reject, cancel, complete)
export const changeRequestStatus = createAsyncThunk(
    'requests/changeStatus',
    async (
        { id, status }: { id: string; status: string },
        thunkAPI
    ) => {
        try {
            const { error: updateError } = await supabase
                .from('booked_service')
                .update({ status })
                .eq('id', id);
            if (updateError) throw updateError;
            // Fetch the updated request
            const { data, error } = await supabase
                .from('booked_service')
                .select('*')
                .eq('id', id)
                .single();
            if (error || !data) throw new Error('Request not found after update');
            return { ...data };
        } catch (error: unknown) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message || 'Failed to change request status');
            }
            return thunkAPI.rejectWithValue('Failed to change request status');
        }
    }
);

// Supabase: Fetch a single request by ID
export const fetchRequestById = createAsyncThunk(
    'requests/fetchById',
    async (id: string, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from('booked_service')
                .select('*')
                .eq('id', id)
                .single();
            if (error || !data) throw new Error('Request not found');
            console.log('data', data)

            return { ...data };
        } catch (error: unknown) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message || 'Failed to fetch request');
            }
            return thunkAPI.rejectWithValue('Failed to fetch request');
        }
    }
);






const requestsSlice = createSlice({
    name: 'requests',
    initialState: {
        ...initialState,
        requestStatusLoading: false,
        requestStatusError: null as string | null,
    },
    reducers: {
        setRequest(state, action) {
            state.singleRequest = action.payload;
        },
        resetRequest(state) {
            state.singleRequest = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload;
            })
            .addCase(fetchAllRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchRequestsByStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequestsByStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload;
            })
            .addCase(fetchRequestsByStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch requests by status for a customer
            .addCase(fetchCustomerRequestsByStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerRequestsByStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload;
            })
            .addCase(fetchCustomerRequestsByStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch all customer requests
            .addCase(fetchAllCustomerRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCustomerRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload;
            })
            .addCase(fetchAllCustomerRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchRequestById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.singleRequest = null;
            })
            .addCase(fetchRequestById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.singleRequest = action.payload as RequestsState;
                    // Optionally, add to requests array if not present
                    const idx = state.requests.findIndex((r: RequestsState) => r.id === (action.payload as RequestsState).id);
                    if (idx === -1) {
                        state.requests.push(action.payload as RequestsState);
                    }
                } else {
                    state.singleRequest = null;
                }
            })
            .addCase(fetchRequestById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.singleRequest = null;
            })
            // Handle changeRequestStatus thunk
            .addCase(changeRequestStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeRequestStatus.fulfilled, (state, action) => {
                state.loading = false;
                // Update the request in the requests array
                const updated = action.payload as RequestsState;
                const idx = state.requests.findIndex((r) => r.id === updated.id);
                if (idx !== -1) {
                    state.requests[idx] = updated;
                }
                // If the singleRequest is the same, update it too
                if (state.singleRequest && state.singleRequest.id === updated.id) {
                    state.singleRequest = updated;
                }
            })
            .addCase(changeRequestStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add status update reducers
            .addCase(updateRequestStatusIfPaid.pending, (state) => {
                state.requestStatusLoading = true;
                state.requestStatusError = null;
            })
            .addCase(updateRequestStatusIfPaid.fulfilled, (state) => {
                state.requestStatusLoading = false;
                state.requestStatusError = null;
            })
            .addCase(updateRequestStatusIfPaid.rejected, (state, action) => {
                state.requestStatusLoading = false;
                state.requestStatusError = action.payload as string || 'Failed to update request status';
            });
        // Handle fetchBookedServicesByHandyman thunk
        builder
            .addCase(fetchBookedServicesByHandyman.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookedServicesByHandyman.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload;
            })
            .addCase(fetchBookedServicesByHandyman.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setRequest, resetRequest } = requestsSlice.actions;
export default requestsSlice.reducer;
