import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchCheckLists = createAsyncThunk(
  'checkLists/fetchCheckLists',
  async (workflowId) => {
      const response = await axios.get(`/api/workflows/${workflowId}/checklists`);
      return response.data; // APIからのレスポンスをそのまま返す
      console.log(response.data); // ここでデータ構造を確認
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

const checkListSlice = createSlice({
  name: 'checkLists',
  initialState: {},
  reducers: {},
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
              console.log(JSON.stringify(newCheckLists, null, 2));
              return { ...state, ...newCheckLists }; // ステートを更新
          });
  },
});

// セレクタを追加（必要に応じて）
export const selectCheckListsByColumn = (state) => state.checkLists;

export default checkListSlice.reducer;
