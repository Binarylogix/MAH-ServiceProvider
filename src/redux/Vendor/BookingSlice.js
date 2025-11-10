import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Async thunk to fetch bookings
export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('vendorToken');
      const response = await axios.get(
        'https://www.makeahabit.com/api/v1/booking/vendorBooking',
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log('booking', response.data.data);
      if (response.data?.success) {
        return response.data.data;
      } else {
        return thunkAPI.rejectWithValue(response.data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Async thunk to complete booking
export const completeBooking = createAsyncThunk(
  'booking/completeBooking',
  async ({ bookingId, pin }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('vendorToken');
      const response = await axios.put(
        `https://www.makeahabit.com/api/v1/booking/complete-order/${bookingId}`,
        { pin },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data?.success) {
        return bookingId;
      } else {
        return thunkAPI.rejectWithValue(response.data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const BookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    loading: false,
    error: null,
    completing: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBookings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch bookings';
      })
      .addCase(completeBooking.pending, state => {
        state.completing = true;
        state.error = null;
      })
      .addCase(completeBooking.fulfilled, (state, action) => {
        const bookingId = action.payload;
        // Update status of booking to "Completed"
        const index = state.bookings.findIndex(b => b._id === bookingId);
        if (index !== -1) {
          state.bookings[index].status = 'Completed';
        }
        state.completing = false;
      })
      .addCase(completeBooking.rejected, (state, action) => {
        state.completing = false;
        state.error = action.payload || 'Failed to complete booking';
      });
  },
});

export default BookingSlice.reducer;
