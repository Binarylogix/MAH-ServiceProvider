import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Verify OTP API
export const verifyVendorOtp = createAsyncThunk(
  'vendorAuth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://www.makeahabit.com/api/v1/newauth/verifyotp/vendor',
        { email, otp },
        { headers: { 'Content-Type': 'application/json' } },
      );

      return response.data; // return full data to component
    } catch (error) {
      console.log('Verify OTP Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: 'Network error' },
      );
    }
  },
);

// ✅ Resend OTP API
export const resendVendorOtp = createAsyncThunk(
  'vendorAuth/resendOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://www.makeahabit.com/api/v1/newauth/send-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();
      if (response.ok && (data.success === true || data.success === 'true')) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      console.log('Resend OTP Error:', error.message);
      return rejectWithValue({ message: 'Network error' });
    }
  },
);

const VendorAuthSlice = createSlice({
  name: 'vendorAuth',
  initialState: {
    loading: false,
    resendLoading: false,
    data: null,
    resendData: null,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // 🔹 Verify OTP reducers
      .addCase(verifyVendorOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyVendorOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(verifyVendorOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Resend OTP reducers
      .addCase(resendVendorOtp.pending, state => {
        state.resendLoading = true;
        state.error = null;
      })
      .addCase(resendVendorOtp.fulfilled, (state, action) => {
        state.resendLoading = false;
        state.resendData = action.payload;
      })
      .addCase(resendVendorOtp.rejected, (state, action) => {
        state.resendLoading = false;
        state.error = action.payload;
      });
  },
});

export default VendorAuthSlice.reducer;
