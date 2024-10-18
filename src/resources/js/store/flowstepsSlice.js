import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Sliceの定義
export const flowstepsSlice = createSlice({
  name: 'flowsteps',
  initialState: [],
  reducers: {
    setFlowsteps: (state, action) => {
      return action.payload; // Sets new flowsteps array
    },
    deleteFlowstep: (state, action) => {
      const updatedFlowsteps = state.filter(flowstep => flowstep.id !== action.payload);
      console.log('Updated flowsteps after deletion:', updatedFlowsteps); // Debug
      return updatedFlowsteps;
    },
  },
});

// FlowStepをサーバーから取得するアクション
export const fetchFlowsteps = () => async (dispatch) => {
  const response = await fetch('/api/flowsteps');
  const data = await response.json();
  dispatch(flowstepsSlice.actions.setFlowsteps(data)); // 取得したデータで状態を更新
};

// FlowStepを追加するアクション
export const addFlowstep = (newFlowstep) => async (dispatch) => {
  const response = await fetch('/api/flowsteps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
    },
    body: JSON.stringify(newFlowstep),
  });
  
  const data = await response.json();
  // 追加が成功した場合に再フェッチ
  if (response.ok) {
    dispatch(fetchFlowsteps()); // 新しいフローステップを追加した後、最新のリストを取得
  }
};

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

// Export actions
export const { setFlowsteps, deleteFlowstep } = flowstepsSlice.actions;
// Export reducer and async action
export default flowstepsSlice.reducer;
