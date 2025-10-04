import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  values: [],
};
const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {},
});

export const {} = UserSlice.actions;
export default UserSlice.reducer;
