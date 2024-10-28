import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
                maxRedirects: 0,
            });
            return response.data; // 返り値として新しいワークフローを返す
        } catch (error) {
            if (error.response && error.response.status === 302 && error.response.headers.location) {
                window.location.href = error.response.headers.location;
            }
            return rejectWithValue('Failed to create workflow');
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
            });
    },
});

export const { clearFlashMessage, setWorkflowId } = workflowSlice.actions;
export default workflowSlice.reducer;
