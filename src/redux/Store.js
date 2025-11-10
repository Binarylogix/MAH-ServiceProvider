import { configureStore } from '@reduxjs/toolkit';
// import UserReducer from './slices/UserSlice';
// import counterReducer from './slices/counterSlice';
// import SalonListReducer from './slices/SalonListSlice';
// import CategoryListReducer from './slices/CategoryListSlice';
// import ServiceCategoryReducer from './slices/ServiceCategory';
import vendorAuthReducer from './Vendor/VendorAuthSlice';
import vendorReducer from './Vendor/CreateVendorSlice';
import vendorDetailsReducer from './Vendor/vendorDetailsSlice';
import bookingReducer from './Vendor/BookingSlice';
import transactionReducer from './Vendor/transactionSlice';

const store = configureStore({
  reducer: {
    // user: UserReducer,
    // salonList: SalonListReducer,
    // CategoryList: CategoryListReducer,
    // serviceCategories: ServiceCategoryReducer,
    // counter: counterReducer,
    booking: bookingReducer,
    vendorAuth: vendorAuthReducer,
    vendor: vendorReducer,
    vendorDetails: vendorDetailsReducer,
    transaction: transactionReducer,
  },
});

export default store;
