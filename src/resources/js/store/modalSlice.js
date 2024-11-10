import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showingChecklistsOnDocument: true,
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
    openAddFlowstepModal: (state) => {
      state.isAddFlowstepModalOpen = true;
    },
    closeAddFlowstepModal: (state) => {
      state.isAddFlowstepModalOpen = false;
    },
    openUpdateFlowstepModal: (state) => {
      state.isUpdateFlowstepModalOpen = true;
    },
    closeUpdateFlowstepModal: (state) => {
      state.isUpdateFlowstepModalOpen = false;
    },
    openDocumentSettingsModal: (state) => {
      state.isDocumentSettingsModalOpen = true;
    },
    closeDocumentSettingsModal: (state) => {
      state.isDocumentSettingsModalOpen = false;
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
  openDocumentSettingsModal,
  closeDocumentSettingsModal,
} = modalSlice.actions;

export default modalSlice.reducer;
