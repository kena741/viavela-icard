import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-hot-toast';

interface DeleteServiceState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: DeleteServiceState = {
  loading: false,
  error: null,
  success: false,
};

export const deleteService = createAsyncThunk(
  'service/deleteService',
  async (serviceId: string, thunkAPI) => {
    console.log('Deleting service with ID:', serviceId);

    try {
      // 1. Check if the service exists
      const { data: found, error: fetchError } = await supabase
        .from('service')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (fetchError || !found) {
        const msg = fetchError?.message || 'Service not found.';
        toast.error(msg);
        return thunkAPI.rejectWithValue(msg);
      }

      // 2. Check for references in booked_service
      const { data: bookings, error: bookingsError } = await supabase
        .from('booked_service')
        .select('id')
        .eq('service_id', serviceId);

      if (bookingsError) {
        toast.error(bookingsError.message || 'Error checking bookings');
        return thunkAPI.rejectWithValue(bookingsError.message);
      }

      const isReferenced = bookings && bookings.length > 0;

      if (isReferenced) {
        // 3a. Soft delete instead (e.g., mark as archived)
        const { error: softDeleteError } = await supabase
          .from('service')
          .update({ isArchived: true })
          .eq('id', serviceId);

        if (softDeleteError) {
          toast.error(softDeleteError.message || 'Soft delete failed');
          return thunkAPI.rejectWithValue(softDeleteError.message);
        }

        toast.success('Service archived instead of deleted (in use)');
        return serviceId;
      } else {
        // 3b. Safe to delete normally
        const { error: deleteError } = await supabase
          .from('service')
          .delete()
          .eq('id', serviceId);

        if (deleteError) {
          toast.error(deleteError.message || 'Delete failed');
          return thunkAPI.rejectWithValue(deleteError.message);
        }

        toast.success('Service deleted successfully');
        return serviceId;
      }
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Unexpected error';
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);


const deleteServiceSlice = createSlice({
  name: 'deleteService',
  initialState,
  reducers: {
    resetDeleteServiceState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteService.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to delete service';
        state.success = false;
      });
  },
});

export const { resetDeleteServiceState } = deleteServiceSlice.actions;
export const deleteServiceReducer = deleteServiceSlice.reducer;
