import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCheckListModalOpen: false,
  isAddFlowstepModalOpen: false,
  selectedCheckList: null,
  selectedMember: null,
  selectedStepNumber: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openCheckListModal: (state, action) => {
      state.isCheckListModalOpen = true;
      state.selectedCheckList = action.payload.checkList;
    },
    closeCheckListModal: (state) => {
      state.isCheckListModalOpen = false;
      state.selectedCheckList = null;
    },
    openAddFlowstepModal: (state, action) => {
      state.isAddFlowstepModalOpen = true;
      state.selectedMember = action.payload.member;
      state.selectedStepNumber = action.payload.stepNumber;
    },
    closeAddFlowstepModal: (state) => {
      state.isAddFlowstepModalOpen = false;
      state.selectedMember = null;
      state.selectedStepNumber = null;
    }
  },
});

export const {
  openCheckListModal,
  closeCheckListModal,
  openAddFlowstepModal,
  closeAddFlowstepModal,
} = modalSlice.actions;

export default modalSlice.reducer;
