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
    openModalofFormforUpdateChecklist: (state, action) => {
      state.showingModalofFormforUpdateChecklist = true;
      state.selectedCheckList = action.payload.checkList;
    },
    closeModalofFormforUpdateChecklist: (state) => {
      state.showingModalofFormforUpdateChecklist = false;
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
  openModalofFormforUpdateChecklist,
  closeModalofFormforUpdateChecklist,
  openModalofFormforAddFlowstep,
  closeModalofFormforAddFlowstep,
  openModalofFormforUpdateFlowstep,
  closeModalofFormforUpdateFlowstep,
  openDocumentSettingsModal,
  closeDocumentSettingsModal,
} = modalSlice.actions;

export default modalSlice.reducer;
