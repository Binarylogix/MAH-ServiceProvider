import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './slices/UserSlice';
// import counterReducer from './slices/counterSlice';
import SalonListReducer from './slices/SalonListSlice';
import CategoryListReducer from './slices/CategoryListSlice';
import ServiceCategoryReducer from './slices/ServiceCategory';

const store = configureStore({
  reducer: {
    user: UserReducer,
    salonList: SalonListReducer,
    CategoryList: CategoryListReducer,
    serviceCategories: ServiceCategoryReducer,

    // counter: counterReducer,
  },
});

export default store;
