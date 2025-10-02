import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/supabaseClient';


type AssignHandymanModalState = {
  open: boolean;
  requestId: string | null;
  loading?: boolean;
  error?: string | null;
  otp?: string | null;
};

const initialState: AssignHandymanModalState = {
  open: false,
  requestId: null,
  loading: false,
  error: null,
  otp: null,
};

export const assignHandymanToRequest = createAsyncThunk(
  'assignHandymanModal/assignHandymanToRequest',
  async (
    {
      requestId,
      handymanId,
      provider_id,
      otp,
    }: { requestId: string; handymanId: string; provider_id: string; otp: string },
    thunkAPI
  ) => {
    try {
      const providerMySelf = handymanId === provider_id;
      const updateFields: Record<string, string | boolean> = {
        status: 'accepted',
        providerMySelf,
        otp,
      };

      if (!providerMySelf) {
        updateFields.handyman_id = handymanId;
      }
      const { error } = await supabase
        .from('booked_service')
        .update(updateFields)
        .eq('id', requestId);
      console.log('Update fields:', error);
      if (error) throw error;
      return { requestId, handymanId, providerMySelf, otp };
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('Failed to assign handyman');
    }
  }
);


const assignHandymanModalSlice = createSlice({
  name: 'assignHandymanModal',
  initialState,
  reducers: {
    openModal(
      state,
      action: PayloadAction<{ requestId: string }>
    ) {
      state.open = true;
      state.requestId = action.payload.requestId;
    },
    closeModal(state) {
      state.open = false;
      state.requestId = null;
      state.otp = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(assignHandymanToRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otp = null;
      })
      .addCase(assignHandymanToRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.otp = action.payload.otp;
        state.error = null;
      })
      .addCase(assignHandymanToRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Assignment failed';
      });
  },
});

export const { openModal, closeModal } = assignHandymanModalSlice.actions;
export default assignHandymanModalSlice.reducer;
