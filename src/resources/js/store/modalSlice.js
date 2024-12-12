import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showingChecklistsOnDocument: true,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModalofFormforAddFlowstep: (state) => {
      state.showingModalofFormforAddFlowstep = true;
    },
    closeModalofFormforAddFlowstep: (state) => {
      state.showingModalofFormforAddFlowstep = false;
    },
    openModalofFormforUpdateFlowstep: (state) => {
      state.showingModalofFormforUpdateFlowstep = true;
    },
    closeModalofFormforUpdateFlowstep: (state) => {
      state.showingModalofFormforUpdateFlowstep = false;
    },
    openCheckListModal: (state, action) => {
      state.isCheckListModalOpen = true;
      state.selectedCheckList = action.payload.checkList;
    },
    closeCheckListModal: (state) => {
      state.isCheckListModalOpen = false;
      state.selectedCheckList = null;
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
  openModalofFormforAddFlowstep,
  closeModalofFormforAddFlowstep,
  openModalofFormforUpdateFlowstep,
  closeModalofFormforUpdateFlowstep,
  openDocumentSettingsModal,
  closeDocumentSettingsModal,
} = modalSlice.actions;

export default modalSlice.reducer;
