import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataBaseIconPositions: [],
  flowstepPositions: [],
};

const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    setDataBaseIconPositions: (state, action) => {
      state.dataBaseIconPositions = action.payload;
    },
    setFlowstepPositions: (state, action) => {
      state.flowstepPositions = action.payload;
    },
  },
});

export const { setDataBaseIconPositions, setFlowstepPositions } = positionsSlice.actions;
export default positionsSlice.reducer;
