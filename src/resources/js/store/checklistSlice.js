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

export const updateChecklist = createAsyncThunk(
  'checklists/updateChecklist',
  async ({ workflowId, checklistId, updatedData }) => {
    const response = await axios.put(`/api/workflows/${workflowId}/checklists/${checklistId}`, updatedData);
    return response.data;
  }
);

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
          })
          .addCase(updateChecklist.pending, (state) => {
            state.loading = true;
          })
          .addCase(updateChecklist.fulfilled, (state, action) => {
            const { flow_number, id, ...updatedChecklist } = action.payload;
          
            // flow_numberが存在しない場合に対応するための条件を追加
            // if (state.items[flow_number]) {
            //   state.items[flow_number] = state.items[flow_number].map((checklist) =>
            //     checklist.id === id ? { ...checklist, ...updatedChecklist } : checklist
            //   );
            // } else {
            //   // 新しいflow_numberが追加された場合などに備えてデフォルトの設定
            //   state.items[flow_number] = [{ id, ...updatedChecklist }];
            // }
            // state.loading = false;
          })
          .addCase(updateChecklist.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
  },
});

// セレクタを追加（必要に応じて）
export const selectCheckListsByColumn = (state) => state.checkLists;

export default checkListSlice.reducer;
