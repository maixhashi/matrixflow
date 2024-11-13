import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  positions: [],
};

const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    setPositions: (state, action) => {
      state.positions = action.payload;
    },
  },
});

export const { setPositions } = positionsSlice.actions;
export default positionsSlice.reducer;
