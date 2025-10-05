import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import noImage from '../../assets/images/noimage.jpg';

// ✅ Async thunk to fetch service categories from API response
export const fetchServiceCategoryList = createAsyncThunk(
  'ServiceCategoryList/fetchServiceCategoryList',
  async (categoryId, thunkAPI) => {
    try {
      const response = await axios.get(
        `https://www.makeahabit.com/api/v1/servicecategory/getServiceCategoryByCategoryId/${categoryId}`
      );

     const data = response.data;
console.log("Service Categories API Response:", data);



      if (data.success && Array.isArray(data)) {
        // Extract unique categories from nested "category"
        const categoriesMap = {};
        data.forEach(service => {
          const cat = service.category;
            categoriesMap[cat._id] = {
              _id: cat._id,
              name: cat.name || 'Unknown',
              img: cat.img
                ? { uri: `https://www.makeahabit.com/api/v1/uploads/${cat.img}` }
                : noImage,
            };
        });
        return Object.values(categoriesMap);
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

const ServiceCategorySlice = createSlice({
  name: 'ServiceCategoryList',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchServiceCategoryList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceCategoryList.fulfilled, (state, action) => {
        state.loading = false;
        state.values = action.payload;
      })
      .addCase(fetchServiceCategoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });
  },
});

export default ServiceCategorySlice.reducer;
