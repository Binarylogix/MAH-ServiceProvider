import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

export const registerVendor = createAsyncThunk(
  'vendor/registerVendor',
  async (formData, { rejectWithValue }) => {
    console.log(formData);
    try {
      const response = await axios.post(
        'https://www.makeahabit.com/api/v1/newauth/registerVendor',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (!response.data?.success) {
        return rejectWithValue(response.data?.message || 'Registration failed');
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || 'Network error',
      );
    }
  },
);

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    resetVendorState: state => {
      console.log('🔄 Resetting vendor state');
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerVendor.pending, state => {
        console.log('⏳ Register vendor request started...');
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerVendor.fulfilled, (state, action) => {
        console.log('✅ Vendor registration fulfilled:', action.payload);
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(registerVendor.rejected, (state, action) => {
        console.log('❌ Vendor registration failed:', action.payload);
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { resetVendorState } = vendorSlice.actions;
export default vendorSlice.reducer;
