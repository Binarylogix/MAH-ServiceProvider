import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

/* ===============================
   BASE CONFIG
================================ */
const API_BASE_URL = 'https://www.makeahabit.com/api/v1';

/* ===============================
   ADD BANK DETAILS
================================ */
export const addBankDetailsAPI = createAsyncThunk(
  'bankDetails/add',
  async (bankData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('vendorToken');

      const response = await axios.post(
        `${API_BASE_URL}/bankDetails/create`,
        {
          accountHolderName: bankData.accountHolderName,
          bankName: bankData.bankName,
          ifsc: bankData.ifsc,
          accountNumber: bankData.accountNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error);
      // console.log(error);
      return rejectWithValue(
        error?.response?.data || { message: 'Add bank details failed' },
      );
    }
  },
);

/* ===============================
   GET BANK DETAILS (ME)
================================ */
export const getBankDetailsAPI = createAsyncThunk(
  'bankDetails/get',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('vendorToken');

      const response = await axios.get(`${API_BASE_URL}/bankDetails/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error);
      return rejectWithValue(
        error?.response?.data || { message: 'Fetch bank details failed' },
      );
    }
  },
);

/* ===============================
   SLICE
================================ */
const bankDetailsSlice = createSlice({
  name: 'bankDetails',
  initialState: {
    bankDetails: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearBankState: state => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: builder => {
    builder
      /* ADD BANK DETAILS */
      .addCase(addBankDetailsAPI.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBankDetailsAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.bankDetails = action.payload.data;
        state.successMessage = action.payload.message;
      })
      .addCase(addBankDetailsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
      })

      /* GET BANK DETAILS */
      .addCase(getBankDetailsAPI.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBankDetailsAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.bankDetails = action.payload.data;
      })
      .addCase(getBankDetailsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
      });
  },
});

export const { clearBankState } = bankDetailsSlice.actions;
export default bankDetailsSlice.reducer;
