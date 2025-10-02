import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { ServiceModel, SubCategoryModel } from './serviceSlice';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-hot-toast';
import { uploadFilesToSupabase } from '../uploadFilesToSupabase';

interface EditServiceState {
  open: boolean;
  service: ServiceModel | null;
  coverIdx: number;
  images: string[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: EditServiceState = {
  open: false,
  service: null,
  coverIdx: 0,
  images: [],
  loading: false,
  error: null,
  success: false,
};

export type UpdateServiceArgs = Partial<ServiceModel> & {
  id: string;
  videoFile?: File;
  removeVideo?: boolean;
};

export const updateService = createAsyncThunk<ServiceModel, UpdateServiceArgs>(
  'editService/updateService',
  async (args, thunkAPI) => {
    try {
      const { id, videoFile, removeVideo, ...rest } = args;
      if (!id) throw new Error('Service ID is required');

      const { data: original, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        toast.error(fetchError.message || 'Failed to fetch original service');
        return thunkAPI.rejectWithValue(fetchError.message || 'Failed to fetch original service');
      }

      const providerId =
        (rest.provider_id as string | undefined) ||
        ((original as ServiceModel).provider_id as string | undefined);

      let finalVideoUrl: string | null | undefined =
        (rest as ServiceModel).video ?? (original as ServiceModel).video ?? null;

      if (removeVideo) {
        finalVideoUrl = null;
      } else if (videoFile && providerId) {
        const uploaded = await uploadFilesToSupabase(
          [videoFile],
          `public/${providerId}/videos`
        );
        finalVideoUrl = uploaded[0] || null;
      }

      const s = rest as ServiceModel & { subCategoryModel?: SubCategoryModel };
      const fields: (keyof ServiceModel)[] = [
        'serviceName',
        'categoryModel',
        'categoryId',
        'subCategoryModel',
        'subCategoryId',
        'description',
        'price',
        'duration',
        'serviceImage',
        'discount',
        'type',
        'status',
        'prePayment',
        'feature',
        'serviceLocationMode',
        'video',
      ];

      const serviceData: Partial<ServiceModel> = {};
      for (const key of fields) {
  const newValue = key === 'video' ? finalVideoUrl : (s as unknown as Record<string, unknown>)[key];
  const oldValue = (original as Record<string, unknown>)[key];
        const isEqual =
          typeof newValue === 'object' && newValue !== null
            ? JSON.stringify(newValue) === JSON.stringify(oldValue)
            : newValue === oldValue;
        if (!isEqual && newValue !== undefined) {
          (serviceData as Record<string, unknown>)[key] = newValue;
        }
      }

      if (Object.keys(serviceData).length === 0) {
        toast('No changes to update.', { icon: 'ℹ️' });
        return original as ServiceModel;
      }

      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast.error(error.message || 'Failed to update service');
        return thunkAPI.rejectWithValue(error.message || 'Failed to update service');
      }

      toast.success('Service updated successfully');
      return { ...original, ...serviceData, ...data } as ServiceModel;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update service';
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const editServiceSlice = createSlice({
  name: 'editService',
  initialState,
  reducers: {
    openEditModal(state, action: PayloadAction<ServiceModel>) {
      state.open = true;
      state.service = action.payload;
      state.coverIdx = 0;
      state.images = action.payload.serviceImage || [];
    },
    closeEditModal(state) {
      state.open = false;
      state.service = null;
      state.coverIdx = 0;
      state.images = [];
    },
    setCoverIdx(state, action: PayloadAction<number>) {
      state.coverIdx = action.payload;
    },
    setImages(state, action: PayloadAction<string[]>) {
      state.images = action.payload;
    },
    updateServiceLocal(state, action: PayloadAction<Partial<ServiceModel>>) {
      if (state.service) {
        Object.assign(state.service, action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.service = action.payload;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = (action.payload as string) || 'Failed to update service';
      });
  },
});

export const { openEditModal, closeEditModal, setCoverIdx, setImages, updateServiceLocal } = editServiceSlice.actions;
export default editServiceSlice.reducer;