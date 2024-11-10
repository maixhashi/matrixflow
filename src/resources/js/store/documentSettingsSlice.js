import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showingChecklistsOnDocument: true,
  showingFlowstepDescriptionsOnDocument: true,
  PDFViewerMode: false
};

const documentSettingsSlice = createSlice({
  name: 'documentSettings',
  initialState,
  reducers: {
    showChecklistsOnDocument: (state) => {
      state.showingChecklistsOnDocument = true;
    },
    hideChecklistsOnDocument: (state) => {
      state.showingChecklistsOnDocument = false;
    },
    showFlowstepDescriptionsOnDocument: (state) => {
      state.showingFlowstepDescriptionsOnDocument = true;
    },
    hideFlowstepDescriptionsOnDocument: (state) => {
      state.showingFlowstepDescriptionsOnDocument = false;
    },
    onPDFViewerMode: (state) => {
      state.PDFViewerMode = true;
    },
    offPDFViewerMode: (state) => {
      state.PDFViewerMode = false;
    },
  },
});

export const {
  showChecklistsOnDocument,
  hideChecklistsOnDocument,
  showFlowstepDescriptionsOnDocument,
  hideFlowstepDescriptionsOnDocument,
  onPDFViewerMode,
  offPDFViewerMode
} = documentSettingsSlice.actions;

export default documentSettingsSlice.reducer;
