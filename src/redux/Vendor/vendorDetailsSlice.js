import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchVendorDetails = createAsyncThunk(
  'vendor/fetchVendorDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('vendorToken');
      const id = await AsyncStorage.getItem('vendorId');
      console.log(token);

      if (!token || !id) return rejectWithValue('Token or ID missing');

      const response = await fetch(
        `https://www.makeahabit.com/api/v1/vendor/details/${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(
          data.message || 'Failed to fetch vendor details',
        );
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const vendorDetailsSlice = createSlice({
  name: 'vendorDetails',
  initialState: {
    vendor: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearVendorDetails: state => {
      state.vendor = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchVendorDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload;
      })
      .addCase(fetchVendorDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVendorDetails } = vendorDetailsSlice.actions;
export default vendorDetailsSlice.reducer;
