import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showingChecklistsOnDocument: true,
  showingFlowstepDescriptionsOnDocument: true,
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
  },
});

export const {
  showChecklistsOnDocument,
  hideChecklistsOnDocument,
  showFlowstepDescriptionsOnDocument,
  hideFlowstepDescriptionsOnDocument,
} = documentSettingsSlice.actions;

export default documentSettingsSlice.reducer;
