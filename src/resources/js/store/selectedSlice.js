import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedMember: null,  // 初期状態ではnullに設定
  selectedStepNumber: null,  // 初期状態ではnullに設定
};

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    setSelectedMember: (state, action) => {
      state.selectedMember = action.payload;
    },
    setSelectedStepNumber: (state, action) => {
      state.selectedStepNumber = action.payload;
    },
  },
});

export const { setSelectedMember, setSelectedStepNumber } = selectedSlice.actions;

export default selectedSlice.reducer;
