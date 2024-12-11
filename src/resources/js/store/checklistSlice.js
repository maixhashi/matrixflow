import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  showingChecklistsOnDocument: true,
};

export const fetchCheckLists = createAsyncThunk(
  'checkLists/fetchCheckLists',
  async (workflowId) => {
      const response = await axios.get(`/api/workflows/${workflowId}/checklists`);
      return response.data;
  }
);

export const addCheckList = createAsyncThunk(
  'checklists/addCheckList',
  async ({ workflowId, checklist }) => {
      const response = await axios.post(`/api/workflows/${workflowId}/checklists`, checklist);
      return response.data;
  }
);

export const selectCheckListsByFlowNumber = (flowNumber) => (state) => {
    return state.checklists ? state.checklists.filter(checklist => checklist.flownumber_for_checklist === flowNumber) : [];
};
  
  

export const updateChecklist = createAsyncThunk(
  'checklists/updateChecklist',
  async ({ workflowId, checklistId, updatedData }) => {
    const response = await axios.put(`/api/workflows/${workflowId}/checklists/${checklistId}`, updatedData);
    return response.data;
  }
);

export const deleteChecklist = createAsyncThunk(
  'checklists/deleteChecklist',
  async ({ checklistId }) => {
    await axios.delete(`/api/checklists/${checklistId}`);
    return checklistId;
  }
);

const checkListSlice = createSlice({
  name: 'checkLists',
  initialState,
  reducers: {
    showChecklistsOnDocument: (state) => {
      state.showingChecklistsOnDocument = true;
    },
    hideChecklistsOnDocument: (state) => {
      state.showingChecklistsOnDocument = false;
    },
  },
  extraReducers: (builder) => {
      builder
          .addCase(fetchCheckLists.fulfilled, (state, action) => {
              const newCheckLists = action.payload.reduce((acc, checklist) => {
                  const flowNumber = checklist.flownumber_for_checklist;
                  if (!acc[flowNumber]) {
                      acc[flowNumber] = [];
                  }
                  acc[flowNumber].push(checklist);
                  return acc;
              }, {});
              return { ...state, ...newCheckLists };
          })
          .addCase(updateChecklist.fulfilled, (state, action) => {
              const { flow_number, id, ...updatedChecklist } = action.payload;
              if (state[flow_number]) {
                  state[flow_number] = state[flow_number].map((checklist) =>
                      checklist.id === id ? { ...checklist, ...updatedChecklist } : checklist
                  );
              } else {
                  state[flow_number] = [{ id, ...updatedChecklist }];
              }
          })
          .addCase(deleteChecklist.fulfilled, (state, action) => {
              const checklistId = action.payload;
              Object.keys(state).forEach((flowNumber) => {
                  state[flowNumber] = state[flowNumber].filter(
                      (checklist) => checklist.id !== checklistId
                  );
              });
          });
  },
});

export const {
  showChecklistsOnDocument,
  hideChecklistsOnDocument
} = checkListSlice.actions;

export const selectCheckListsByColumn = (state) => state.checkLists;
export default checkListSlice.reducer;
