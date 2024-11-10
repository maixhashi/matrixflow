import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showingChecklistsOnDocument: true,
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
  },
});

export const {
  showChecklistsOnDocument,
  hideChecklistsOnDocument
} = documentSettingsSlice.actions;

export default documentSettingsSlice.reducer;
