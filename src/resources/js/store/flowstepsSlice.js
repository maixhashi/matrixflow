import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// FlowStepを取得するアクション
export const fetchFlowsteps = createAsyncThunk(
  'flowsteps/fetchFlowsteps',
  async (workflowId, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/workflows/${workflowId}/flowsteps`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch flowsteps');
      }
      const data = response.data;
      console.log('Fetched FlowSteps:', data); // デバッグログ
      dispatch(setFlowsteps(data)); // ステート更新
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// FlowStepを追加するアクション
export const addFlowstep = createAsyncThunk(
  'flowsteps/addFlowstep',
  async ({ workflowId, newFlowstep }, { rejectWithValue }) => {
      try {
          const response = await axios.post(`/api/workflows/${workflowId}/flowsteps`, newFlowstep);
          return response.data; // レスポンスデータを返す
      } catch (error) {
          return rejectWithValue(error.response?.data || error.message);
      }
  }
);


// FlowStepを削除するアクション
export const deleteFlowstepAsync = (id) => async (dispatch, getState) => {
  console.log(`Deleting flow step with ID: ${id}`);
  
  const currentFlowsteps = getState().flowsteps; // 現在のFlowStepの状態を取得
  
  try {
    const response = await axios.delete(`/api/flowsteps/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log(`Flow step with ID ${id} deleted successfully.`);
      dispatch(flowstepsSlice.actions.deleteFlowstep(id)); // 正しいアクション名を使用
      console.log('Redux state updated successfully.');
    } else {
      console.error('Failed to delete flow step:', response.statusText);
      const errorData = await response.json();
      console.error('Error details:', errorData);
    }
  } catch (error) {
    console.error('Error during the fetch process:', error);
  }

  console.log('Delete operation complete.');
};

// Async thunk for assigning flow steps
export const assignFlowStep = createAsyncThunk(
  'flowsteps/assignFlowStep',
  async ({ memberId, flowstepId, assignedMembersBeforeDrop }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post('/api/assign-flowstep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId, flowstepId, assignedMembersBeforeDrop }),
      });

      if (!response.ok) {
        return rejectWithValue('Failed to assign FlowStep');
      }

      const result = await response.json();

      // 成功したら、状態を更新するためにdispatchを使用
      dispatch(flowstepsSlice.actions.editFlowstep({ id: flowstepId, updatedFlowstep: result }));
      
      return result; // 必要に応じて戻り値を変更
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// FlowStepを編集するアクション
export const updateFlowstep = createAsyncThunk(
  'flowsteps/updateFlowstep',
  async ({ updatedFlowstep }, { dispatch, rejectWithValue }) => {
    try {
      // flowNumber を flow_number に変更
      const response = await axios.put(`/api/flowsteps/${updatedFlowstep.id}`, {
        ...updatedFlowstep,
        flow_number: updatedFlowstep.flow_number // flow_number にリネーム
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      dispatch(flowstepsSlice.actions.editFlowstep({ id: updatedFlowstep.id, updatedFlowstep: response.data }));
      
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// FlowStepを編集するアクション
export const updateFlowstepName = createAsyncThunk(
  'flowsteps/updateFlowstepName',
  async ({ id, updatedFlowstep }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/flowsteps/update-name/${id}`, updatedFlowstep, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 成功した場合はstateを更新するアクションをdispatch
      dispatch(flowstepsSlice.actions.editFlowstep({ id, updatedFlowstep: response.data }));
      
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// FlowStep番号を更新するアクション
export const updateFlowStepNumber = createAsyncThunk(
  'flowsteps/updateFlowStepNumber',
  async ({ flowStepId, newFlowNumber }, { dispatch, rejectWithValue }) => {

    try {
      const response = await axios.post('/api/update-flowstep-stepnumber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flowStepId, newFlowNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to update FlowStep number');
      }

      return { flowStepId, newFlowNumber }; // 必要に応じて戻り値を変更
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const flowstepsSlice = createSlice({
  name: 'flowsteps',
  initialState: [],
  reducers: {
    setFlowsteps: (state, action) => {
      return action.payload; // 新しいFlowStepの配列を設定
    },
    deleteFlowstep: (state, action) => {
      const updatedFlowsteps = state.filter(flowstep => flowstep.id !== action.payload);
      console.log('Updated flowsteps after deletion:', updatedFlowsteps); // デバッグ
      return updatedFlowsteps;
    },
    editFlowstep: (state, action) => {
      const { id, updatedFlowstep } = action.payload;
      return state.map(flowstep =>
        flowstep.id === id ? { ...flowstep, ...updatedFlowstep } : flowstep
      ); // 特定のFlowStepを更新
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlowsteps.fulfilled, (state, action) => {
        return action.payload; // ステートを新しいメンバーリストで更新
      })
      .addCase(addFlowstep.fulfilled, (state, action) => {
        state.push(action.payload); // 新しいメンバーを追加
      })
      .addCase(assignFlowStep.fulfilled, (state, action) => {
        // assignFlowStepの成功時にstateを更新
        const { id, updatedFlowstep } = action.payload;
        return state.map(flowstep =>
          flowstep.id === id ? { ...flowstep, ...updatedFlowstep } : flowstep
        );
      });
  },
});

// Export actions
export const { setFlowsteps, deleteFlowstep, editFlowstep } = flowstepsSlice.actions;
// Export reducer and async action
export default flowstepsSlice.reducer;