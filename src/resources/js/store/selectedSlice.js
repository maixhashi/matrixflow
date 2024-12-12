import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedMember: null,  // 初期状態ではnullに設定
  selectedFlowstep: null,  // 初期状態ではnullに設定
  selectedStepNumber: null,  // 初期状態ではnullに設定
  selectedToolsystem: null,  // 初期状態ではnullに設定
};

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    setSelectedMember: (state, action) => {
      state.selectedMember = action.payload;
    },
    setSelectedFlowstep: (state, action) => {
      state.selectedFlowstep = action.payload;
      console.log("selectedFlowstep:", state.selectedFlowstep)
    },
    setSelectedStepNumber: (state, action) => {
      state.selectedStepNumber = action.payload;
    },
    setSelectedToolsystem: (state, action) => {
      state.selectedToolsystem = action.payload;
    }
  },
});

export const { setSelectedMember, setSelectedFlowstep, setSelectedStepNumber, setSelectedToolsystem } = selectedSlice.actions;

export default selectedSlice.reducer;
