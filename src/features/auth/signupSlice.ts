import { supabase } from '@/supabaseClient';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface CreateUserState {
    loading: boolean;
    error: string | null;
    userId: string | null;
}

const initialState: CreateUserState = {
    loading: false,
    error: null,
    userId: null,
};

export interface CreateUserWithRoleParams {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    countryCode: string;
    address?: string;
    loginType?: 'email' | 'google';
    createdAt?: string;
}

function getFriendlyErrorMessage(rawMessage: string) {
    if (!rawMessage) return 'Unknown error occurred.';
    const msg = rawMessage.toLowerCase();
    if (msg.includes('already registered') || msg.includes('account already exists')) return 'Email already registered, please try with new email';
    if (msg.includes('duplicate key')) return 'Duplicate key violation (likely a unique constraint).';
    if (msg.includes('not null')) return 'A required field is missing (NOT NULL constraint).';
    if (msg.includes('foreign key')) return 'Foreign key violation (related record missing).';
    if (msg.includes('password')) return 'Password is too weak or invalid.';
    if (msg.includes('row-level security')) return 'Blocked by RLS.';
    if (msg.includes('network')) return 'Network error. Please check your connection.';
    return rawMessage;
}

interface AdminCreateUserResponse {
    userId?: string;
    error?: string;
}



export const createUserAsync = createAsyncThunk(
    'auth/createUser',
    async (userData: CreateUserWithRoleParams, { rejectWithValue }) => {
        try {
            const email = (userData.email || '').trim().toLowerCase();
            const password = userData.password;
            // Create user with Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        phoneNumber: userData.phoneNumber,
                        countryCode: userData.countryCode,
                        address: userData.address,
                        loginType: userData.loginType ?? 'email',
                        createdAt: userData.createdAt,
                    }
                }
            });
            if (error || !data.user) {
                throw new Error(getFriendlyErrorMessage(error?.message || 'Signup failed'));
            }

            // Insert into customer table after registration (always customer)
            const { error: customerError } = await supabase.from('customers').insert([
                {
                    user_id: data.user.id,
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    phone_number: userData.phoneNumber,
                    email: email,
                    address: userData.address || '',
                    country_code: userData.countryCode,
                    created_at: userData.createdAt || new Date().toISOString(),
                }
            ]);
            if (customerError) {
                throw new Error('User created but failed to add customer info: ' + customerError.message);
            }

            return data.user.id;
        } catch (error: unknown) {
            let errorMessage = 'Failed to create user.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

const createuserSlice = createSlice({
    name: 'createuser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createUserAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.userId = null;
            })
            .addCase(createUserAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.userId = action.payload;
            })
            .addCase(createUserAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default createuserSlice.reducer;
