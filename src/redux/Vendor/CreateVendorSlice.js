import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

// ✅ Async thunk using Axios + console logs
export const registerVendor = createAsyncThunk(
  'vendor/registerVendor',
  async (payload, { rejectWithValue }) => {
    console.log('📤 Sending vendor registration data:', payload); // log input data

    try {
      const response = await axios.post(
        'https://www.makeahabit.com/api/v1/newauth/registerVendor',
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      console.log('✅ Server response:', response.data); // log full response

      const data = response.data;

      if (!data?.success) {
        console.warn('⚠️ Registration failed with message:', data?.message);
        return rejectWithValue(data?.message || 'Registration failed');
      }

      console.log('🎉 Registration successfull:', data);
      return data;
    } catch (error) {
      console.error('❌ Registration API error:', error);

      const message =
        error.response?.data?.message ||
        error.message ||
        'Network error, please try again';

      console.log('⚠️ Error message returned to slice:', message);
      return rejectWithValue(message);
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
