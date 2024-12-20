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

// ワークフローを取得する非同期関数
export const fetchWorkflow = createAsyncThunk(
  'workflow/fetchWorkflow',
  async (workflowId, { rejectWithValue }) => {
      try {
          const response = await axios.get(`/api/workflows/${workflowId}`);
          return response.data; // ワークフロー一覧を返す
      } catch (error) {
          return rejectWithValue('Failed to fetch workflow');
      }
  }
);

export const createWorkflow = createAsyncThunk(
  'workflow/create',
  async (workflowName, { rejectWithValue }) => {

      try {
          const response = await axios.post('/api/workflows', {
              name: workflowName
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
        workflow: {},
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
            })
            .addCase(fetchWorkflow.pending, (state) => {
              state.loading = true;
            })
            .addCase(fetchWorkflow.fulfilled, (state, action) => {
              state.loading = false;
              state.name = action.payload.name; // ワークフロー名を格納
            })
            .addCase(fetchWorkflow.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
            });
    },
});

export const { clearFlashMessage, setWorkflowId } = workflowSlice.actions;
export default workflowSlice.reducer;
