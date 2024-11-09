import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCheckListModalOpen: false,
  isAddFlowstepModalOpen: false,
  isUpdateFlowstepModalOpen: false,
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
    },
    closeAddFlowstepModal: (state) => {
      state.isAddFlowstepModalOpen = false;
    },
    openUpdateFlowstepModal: (state, action) => {
      state.isUpdateFlowstepModalOpen = true;
    },
    closeUpdateFlowstepModal: (state) => {
      state.isUpdateFlowstepModalOpen = false;
    }
  },
});

export const {
  openCheckListModal,
  closeCheckListModal,
  openAddFlowstepModal,
  closeAddFlowstepModal,
  openUpdateFlowstepModal,
  closeUpdateFlowstepModal,
} = modalSlice.actions;

export default modalSlice.reducer;
