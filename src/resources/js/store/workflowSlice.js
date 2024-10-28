import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ワークフローを取得する非同期関数
export const fetchWorkflows = createAsyncThunk(
  'workflow/fetchAll',
  async (_, { rejectWithValue }) => {
      try {
          const response = await axios.get('/api/workflows');
          return response.data; // ワークフロー一覧を返す
      } catch (error) {
          return rejectWithValue('Failed to fetch workflows');
      }
  }
);

export const createWorkflow = createAsyncThunk(
  'workflow/create',
  async (workflowName, { rejectWithValue }) => {
      const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

      try {
          const response = await axios.post('/api/workflows', {
              name: workflowName
          }, {
              headers: {
                  'X-CSRF-TOKEN': token,
              },
          });
          return response.data;
      } catch (error) {
          console.error("Error creating workflow:", error.message, error.response?.data);
          return rejectWithValue(error.response?.data || 'Failed to create workflow');
      }
  }
);

const workflowSlice = createSlice({
    name: 'workflow',
    initialState: {
        workflows: [],
        workflowId: null,
        isSubmitting: false,
        flashMessage: '',
        error: null,
    },
    reducers: {
        clearFlashMessage: (state) => {
            state.flashMessage = '';
        },
        setWorkflowId: (state, action) => {
            state.workflowId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createWorkflow.pending, (state) => {
                state.isSubmitting = true;
            })
            .addCase(createWorkflow.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.workflows.push(action.payload);
                state.workflowId = action.payload.id;
                state.flashMessage = `ワークフローを作成しました: ${action.payload.name}`;
            })
            .addCase(createWorkflow.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload;
                state.flashMessage = action.payload;
            })
            .addCase(fetchWorkflows.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkflows.fulfilled, (state, action) => {
                state.loading = false;
                state.workflows = action.payload;
            })
            .addCase(fetchWorkflows.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearFlashMessage, setWorkflowId } = workflowSlice.actions;
export default workflowSlice.reducer;
