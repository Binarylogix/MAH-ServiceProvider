// redux/Vendor/transactionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Async thunk to fetch vendor transactions
export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const vendorToken = await AsyncStorage.getItem('vendorToken');
      if (!vendorToken) throw new Error('Vendor token not found');

      const response = await axios.get(
        'https://www.makeahabit.com/api/v1/vendor-transaction/vendor/transactions',
        // `https://www.makeahabit.com/api/v1/vendor-transaction/booking-transaction-count`,
        {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        },
      );
      if (response.data.success) {
        console.log('nfjn', response.data);
        return response.data.data; // Assuming 'data' contains the transactions array
      } else {
        return rejectWithValue(
          response.data.message || 'Failed to fetch transactions',
        );
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  },
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Add synchronous reducers if needed
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTransactions.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
