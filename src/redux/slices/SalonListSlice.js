import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import noImage from '../../assets/images/noImage.jpg';

// Async thunk for fetching salon list
export const fetchSalonList = createAsyncThunk(
  'SalonList/fetchSalonList',
  async (_, thunkAPI) => {
    try {
      const API_TOKEN = await AsyncStorage.getItem('userToken');

      const response = await axios.get(
        'https://www.makeahabit.com/api/v1/vendor/all-sallon-list',
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = response.data?.data || [];

      // Map salons data safely
      const mappedSalons = data.map(salon => ({
        _id: salon._id || Math.random().toString(),
        name: salon.businessName || 'Unknown',
        description: salon.description || '',
        city: salon.city || 'N/A',
        state: salon.state || 'N/A',
        rating: salon.avgRating || '0.0',
        category: salon.category || '',
        image: salon.businessCard
          ? {
              uri: `https://www.makeahabit.com/api/v1/uploads/business/${salon.businessCard}`,
            }
          : noImage,
        services: salon.services || [],
        serviceCategory: salon.serviceCategory || null,
      }));

      return mappedSalons;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
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
  reducers: {},
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
