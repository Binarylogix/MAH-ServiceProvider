import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './slices/UserSlice';
// import counterReducer from './slices/counterSlice';
import SalonListReducer from './slices/SalonListSlice';

const store = configureStore({
  reducer: {
    user: UserReducer,
    salonList: SalonListReducer,

    // counter: counterReducer,
  },
});

export default store;
