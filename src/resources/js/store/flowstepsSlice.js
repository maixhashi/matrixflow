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

      dispatch(setFlowsteps(data)); // Assuming setMembers is your action for setting members

      return data; // Return the data if needed
    } catch (error) {
      return rejectWithValue(error.message); // Handle error
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
export const deleteFlowstepAsync = (id) => async (dispatch) => {
  console.log(`Deleting flow step with ID: ${id}`);

  try {
    const response = await fetch(`/api/flowsteps/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
    });

    if (response.ok) {
      console.log(`Flow step with ID ${id} deleted successfully.`);
      dispatch(flowstepsSlice.actions.deleteFlowstep(id)); // 正しいアクション名を使用
      // 削除後に再フェッチ
      dispatch(fetchFlowsteps());
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
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const response = await fetch('/api/assign-flowstep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify({ memberId, flowstepId, assignedMembersBeforeDrop }),
      });
      if (!response.ok) {
        return rejectWithValue('Failed to assign FlowStep');
      }
      const result = await response.json(); // Return the updated data or a success message
      dispatch(fetchFlowsteps()); // 割り当て後に再フェッチ
      return result; // 必要に応じて戻り値を変更
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// FlowStepを編集するアクション
export const updateFlowstepAsync = createAsyncThunk(
  'flowsteps/updateFlowstep',
  async ({ id, updatedFlowstep }, { dispatch, rejectWithValue }) => {
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    try {
      const response = await fetch(`/api/flowsteps/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify(updatedFlowstep),
      });

      if (!response.ok) {
        throw new Error('Failed to edit FlowStep');
      }

      const data = await response.json();
      
      // 成功した場合はstateを更新するアクションをdispatch
      dispatch(flowstepsSlice.actions.editFlowstep({ id, updatedFlowstep: data }));
      
      // 更新後に最新のフローステップを再フェッチ
      dispatch(fetchFlowsteps());
      
      return data;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// FlowStep番号を更新するアクション
export const updateFlowStepNumber = createAsyncThunk(
  'flowsteps/updateFlowStepNumber',
  async ({ flowStepId, newFlowNumber }, { dispatch, rejectWithValue }) => {
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    try {
      const response = await fetch('/api/update-flowstep-stepnumber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify({ flowStepId, newFlowNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to update FlowStep number');
      }

      dispatch(fetchFlowsteps()); // 更新後に再フェッチ
      return { flowStepId, newFlowNumber }; // 必要に応じて戻り値を変更

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Sliceの定義
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
  },
});

// Export actions
export const { setFlowsteps, deleteFlowstep, editFlowstep } = flowstepsSlice.actions;
// Export reducer and async action
export default flowstepsSlice.reducer;
