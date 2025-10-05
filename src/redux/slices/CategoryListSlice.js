import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import noImage from '../../assets/images/noimage.jpg';

// Async thunk to fetch categories
export const fetchCategoryList = createAsyncThunk(
  'CategoryList/fetchCategoryList',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        'https://www.makeahabit.com/api/v1/category/get-all'
      );

      const data = response.data;

      if (data.success && Array.isArray(data.categories)) {
        return data.categories.map(cat => ({
          _id: cat._id || Math.random().toString(),
          name: cat.name || 'Unknown',
          img: cat.img
            ? { uri: `https://www.makeahabit.com/api/v1/uploads/category/${cat.img}` }
            : noImage,
        }));
      } else {
        return [];
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  values: [],
  loading: false,
  error: null,
};

const CategoryListSlice = createSlice({
  name: 'CategoryList',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategoryList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryList.fulfilled, (state, action) => {
        state.loading = false;
        state.values = action.payload;
      })
      .addCase(fetchCategoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });
  },
});

export default CategoryListSlice.reducer;
