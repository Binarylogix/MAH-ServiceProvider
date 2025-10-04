import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk for fetching salon list
export const fetchSalonList = createAsyncThunk(
  'SalonList/fetchSalonList',
  async (_, thunkAPI) => {
    const API_TOKEN = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.get(
        'https://www.makeahabit.com/api/v1/vendor/all-sallon-list',
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = response.data.data;

      // Map salons data
      const mappedSalons = data.map(salon => ({
        _id: salon._id,
        name: salon.businessName,
        description: salon.description || '',
        city: salon.city,
        state: salon.state,
        rating: salon.avgRating,
        image: salon.businessCard
          ? {
              uri: `https://www.makeahabit.com/api/v1/uploads/business/${salon.businessCard}`,
            }
          : FALLBACK_IMAGE,
        services: salon.services || [],
      }));

      return mappedSalons;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response || error.message);
    }
  },
);

const initialState = {
  values: [],
  loading: false,
  error: null,
};

const SalonListSlice = createSlice({
  name: 'SalonList',
  initialState,
  reducers: {
    // Add any synchronous reducers if needed
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSalonList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalonList.fulfilled, (state, action) => {
        state.loading = false;
        state.values = action.payload;
      })
      .addCase(fetchSalonList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch salons';
      });
  },
});

export default SalonListSlice.reducer;
