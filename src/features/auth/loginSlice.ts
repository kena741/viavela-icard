import { supabase } from '@/supabaseClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Social link model
export interface SocialLink {
  type:
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'tiktok'
  | 'youtube'
  | 'website'
  | 'telegram'
  | 'whatsapp'
  | string;
  url: string;
  label?: string;
  enabled?: boolean;
}

// User model
export interface UserModel {
  id?: string;
  user_id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  profileImage?: string;
  phoneNumber?: string;
  banner?: string;
  companyName?: string;
  address?: string;
  countryCode?: string;
  createdAt?: string;
  fcmToken?: string;
  isDocumentVerify?: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
  password?: string;
  slug?: string;
  userType?: string;
  walletAmount?: string;
  active?: boolean;
  bannerImage?: string;
  country?: string;
  currency?: string;
  profileBio?: string;
  professionId?: string;
  categoryId?: string;
  socialLinks?: SocialLink[];
  industry?: string;
  companySize?: string;
  headquarters?: string;
  founded?: string;
  updateAt?: string;
}



interface AuthState {
  isAuthenticated: boolean;
  user: null | UserModel;
  // loading flag for fetching user detail
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
};



// Async thunk for login (Supabase auth)
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        return thunkAPI.rejectWithValue(error?.message || 'Login failed');
      }
      // Only return id and email; getUserDetail will fetch the rest
      return {
        id: data.user.id,
        email: data.user.email || '',
      };
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Login failed');
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      });


      if (error) throw error;

      if (data?.url) {
        window.location.assign(data.url);
      }

      return {
        id: 'pending-google-auth',
        email: 'pending@google.auth',
        authProvider: 'google'
      };

    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Google login failed');
    }
  }
);

export const updateProvider = createAsyncThunk(
  'auth/updateProvider',
  async (data: UserModel, { rejectWithValue }) => {
    try {
      if (!data.id) throw new Error('User ID is required');
      const updateData = { ...data };
      delete updateData.id;
      const { error } = await supabase.from('provider').update(updateData).eq('user_id', data.id);
      console.log('Update provider data:', error);
      if (error) throw error;
      return updateData;
    } catch (error) {
      console.log('Update provider error:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update provider');
    }
  }
);

export const getUserDetail = createAsyncThunk(
  'auth/getUserDetail',
  async (userId: string, thunkAPI) => {
    try {
      // Only fetch from customers table by user_id
      console.log('Fetching user detail for ID:', userId);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();
      console.log('User detail fetched:', data);

      if (!data || error) {
        throw error || new Error('Customer not found');
      }

      // Normalize createdAt
      if ((data as UserModel).createdAt && typeof (data as UserModel).createdAt !== 'string') {
        (data as UserModel).createdAt = new Date((data as UserModel).createdAt as string | number | Date).toISOString();
      }
      return data as UserModel;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Failed to fetch user details');
    }
  }
);

// Async thunk for logout (Supabase)
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Logout failed');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      // Google login (only track errors — success happens after redirect)
      .addCase(loginWithGoogle.rejected, (state) => {
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(getUserDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(getUserDetail.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(updateProvider.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      });
  },
});

// ...no direct actions, using thunks
export default authSlice.reducer;
