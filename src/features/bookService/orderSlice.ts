import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { supabase } from '../../supabaseClient';
import { ServiceModel } from '../service/serviceSlice';

interface OrderState {
    loading: boolean;
    error: string | null;
    orderId: string | null;
}

const initialState: OrderState = {
    loading: false,
    error: null,
    orderId: null,
};

interface CreateOrderParams {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    bookingDate: Date;
    description?: string;
    provider_id: string;
    serviceDetails: ServiceModel;
}

export const createOrderAsync = createAsyncThunk<string, CreateOrderParams, { rejectValue: string }>(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            toast.dismiss();

            let customerId: string | null = null;
            const { data: customerData, error: customerError } = await supabase
                .from('customer')
                .select('id')
                .eq('email', orderData.email)
                .single();
            console.log('Customer data:', customerData);
            if (customerError && customerError.code !== 'PGRST116') throw customerError;

            if (customerData && customerData.id) {
                customerId = customerData.id;
            } else {
                const { data: newCustomer, error: insertCustomerError } = await supabase
                    .from('customer')
                    .insert({
                        first_name: orderData.firstName,
                        last_name: orderData.lastName,
                        email: orderData.email,
                        phone: orderData.phoneNumber,
                    })
                    .select('id')
                    .single();
                if (insertCustomerError) throw insertCustomerError;
                customerId = newCustomer.id;
            }

            const { error: providerCustomerError } = await supabase
                .from('provider_customer')
                .upsert(
                    {
                        provider_id: orderData.provider_id,
                        customer_id: customerId,
                        lastBookedAt: new Date().toISOString(),
                    },
                    { onConflict: 'provider_id,customer_id' }
                );
            console.log('Provider customer upsert response:', providerCustomerError);
            if (providerCustomerError) throw providerCustomerError;

            const { error: orderError, data: insertedOrder } = await supabase
                .from('booked_service')
                .insert({
                    firstName: orderData.firstName,
                    lastName: orderData.lastName,
                    email: orderData.email,
                    phoneNumber: orderData.phoneNumber,
                    provider_id: orderData.provider_id,
                    customer_id: customerId,
                    serviceName: orderData.serviceDetails?.serviceName,
                    service_id: orderData.serviceDetails?.id,
                    price: orderData.serviceDetails?.price,
                    bookingDate: orderData.bookingDate.toISOString(),
                    discount: orderData.serviceDetails.discount || '0',
                    status: 'pending',
                    totalAmount: orderData.serviceDetails?.price || 0,
                    subTotal: orderData.serviceDetails?.price || 0,
                    taxList: [],
                    quantity: '1',
                    paymentCompleted: false,
                    prePaymentExtraChargePayment: false,
                    postJobPayment: false,
                    providerMySelf: false,
                    description: orderData.description || '',
                    serviceImage:
                        Array.isArray(orderData.serviceDetails?.serviceImage) && orderData.serviceDetails.serviceImage.length > 0
                            ? orderData.serviceDetails.serviceImage[0]
                            : '',
                })
                .select('id')
                .single();
            console.log('Order creation response:', insertedOrder, orderError);
            if (orderError) throw orderError;

            const { data: providerRow, error: providerErr } = await supabase
                .from('provider')
                .select('user_id')
                .eq('id', orderData.provider_id)
                .single();
            if (providerErr) throw providerErr;

            const providerUserId = providerRow?.user_id as string | undefined;
            if (providerUserId) {
                const title = 'New Service Booking';
                const when = new Date(orderData.bookingDate).toLocaleString();
                const body = `${orderData.firstName} ${orderData.lastName} booked “${orderData.serviceDetails?.serviceName ?? 'a service'}” for ${when}.`;
                const { error: notifErr } = await supabase.from('notifications').insert({
                    user_id: providerUserId,
                    title,
                    body,
                    is_read: false,
                    request_id: insertedOrder.id,
                });
                if (notifErr) console.warn('[notifications] insert failed:', notifErr.message);
            } else {
                console.warn('[notifications] provider user_id not found; skipping notification');
            }

            toast.dismiss();
            toast.success('Booking successful!');
            return insertedOrder.id;
        } catch (error: unknown) {
            let errorMessage = 'Failed to create order';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.dismiss();
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrder(state) {
            state.orderId = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrderAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.orderId = null;
            })
            .addCase(createOrderAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.orderId = action.payload;
            })
            .addCase(createOrderAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
